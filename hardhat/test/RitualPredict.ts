import { describe, it } from "node:test";
import { network } from "hardhat";
import { encodeAbiParameters, parseAbiParameters, stringToHex, hexToBytes, concat, bytesToHex } from "viem";

// Canonical Ritual addresses
const SCHEDULER = "0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B";
const RITUAL_WALLET = "0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948";
const TEE_SERVICE_REGISTRY = "0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F";
const HTTP_PRECOMPILE = "0x0000000000000000000000000000000000000801";
const JQ_PRECOMPILE = "0x0000000000000000000000000000000000000803";

describe("RitualPredict", async function () {
  const { viem, networkHelpers } = await network.create();

  async function deployMocks() {
    const publicClient = await viem.getPublicClient();
    const scheduler = await viem.deployContract("SchedulerMock");
    const httpMock = await viem.deployContract("HttpPrecompileMock");
    const jqMock = await viem.deployContract("HttpPrecompileMock");
    const wallet = await viem.deployContract("RitualWalletMock");
    const registry = await viem.deployContract("TEEServiceRegistryMock");

    const schedulerBytecode = await publicClient.getBytecode({ address: scheduler.address });
    const httpBytecode = await publicClient.getBytecode({ address: httpMock.address });
    const jqBytecode = await publicClient.getBytecode({ address: jqMock.address });
    const walletBytecode = await publicClient.getBytecode({ address: wallet.address });
    const registryBytecode = await publicClient.getBytecode({ address: registry.address });

    if (!schedulerBytecode || !httpBytecode || !jqBytecode || !walletBytecode || !registryBytecode) {
      throw new Error("Failed to get mock bytecode");
    }

    await networkHelpers.setCode(SCHEDULER, schedulerBytecode);
    await networkHelpers.setCode(HTTP_PRECOMPILE, httpBytecode);
    await networkHelpers.setCode(JQ_PRECOMPILE, jqBytecode);
    await networkHelpers.setCode(RITUAL_WALLET, walletBytecode);
    await networkHelpers.setCode(TEE_SERVICE_REGISTRY, registryBytecode);

    return { scheduler, httpMock, jqMock, wallet, registry };
  }

  it("should deploy and create a market", async function () {
    await deployMocks();
    const publicClient = await viem.getPublicClient();

    const blockTimeMs = 195n;

    const market = await viem.deployContract("RitualPredict", [
      blockTimeMs,
    ]);

    const marketParams = {
        question: "Will it work?",
        oracleUrl: "https://example.com",
        jsonPath: "$.value",
        target: 100n,
        comparator: 0, // GT
        bettingSeconds: 60n,
        resolveDelaySeconds: 30n,
    };

    const hash = await market.write.createMarket([marketParams]);
    await publicClient.waitForTransactionReceipt({ hash });
    
    const marketId = 1n;
    
    const marketData = await market.read.getMarket([marketId]);

    if (marketData.scheduleId === 0n) {
        throw new Error("Market scheduleId was not set");
    }
  });

  it("should enforce OnlyScheduler authorization", async function () {
    await deployMocks();
    const market = await viem.deployContract("RitualPredict", [195n]);
    
    const marketParams = {
        question: "Will it work?",
        oracleUrl: "https://example.com",
        jsonPath: "$.value",
        target: 100n,
        comparator: 0, // GT
        bettingSeconds: 60n,
        resolveDelaySeconds: 30n,
    };
    await market.write.createMarket([marketParams]);

    await viem.assertions.revertWithCustomError(
      market.write.onScheduledResolve([0n, 1n]),
      market,
      "OnlyScheduler"
    );
  });

  it("should successfully resolve a market when called by the scheduler", async function () {
    await deployMocks();
    const market = await viem.deployContract("RitualPredict", [195n]);
    
    const registry = await viem.getContractAt("TEEServiceRegistryMock", TEE_SERVICE_REGISTRY);
    await registry.write.setMockResult(["0x1234567890123456789012345678901234567890", true]);

    const httpMock = await viem.getContractAt("HttpPrecompileMock", HTTP_PRECOMPILE);
    const jqMock = await viem.getContractAt("HttpPrecompileMock", JQ_PRECOMPILE);
    
    const jsonBody = stringToHex('{"value": 150}');
    const actualOutput = encodeAbiParameters(
        parseAbiParameters('uint16, string[], string[], bytes, string'),
        [200, [], [], jsonBody, ""]
    );
    await httpMock.write.setMockResult(['0x', actualOutput as `0x${string}`]);
    
    const jqResult = encodeAbiParameters(
        parseAbiParameters('uint256'),
        [150n]
    );
    await jqMock.write.setMockOutput([jqResult as `0x${string}`]);

    const marketParams = {
        question: "Will it work?",
        oracleUrl: "https://example.com",
        jsonPath: "$.value",
        target: 100n,
        comparator: 0, // GT
        bettingSeconds: 60n,
        resolveDelaySeconds: 30n,
    };
    await market.write.createMarket([marketParams]);

    await networkHelpers.impersonateAccount(SCHEDULER);
    await networkHelpers.setBalance(SCHEDULER, 10n ** 18n);
    const schedulerClient = await viem.getWalletClient(SCHEDULER);

    await market.write.onScheduledResolve([0n, 1n], { account: schedulerClient.account });

    const marketData = await market.read.getMarket([1n]);
    if (marketData.state !== 3) {
        throw new Error(`Market state should be Resolved (3), but was ${marketData.state}`);
    }
    if (marketData.observedValue !== 150n) {
        throw new Error(`Market outcome should be 150, but was ${marketData.observedValue}`);
    }
  });

  it("should revert if no TEE executor is found", async function () {
    await deployMocks();
    const market = await viem.deployContract("RitualPredict", [195n]);
    
    const registry = await viem.getContractAt("TEEServiceRegistryMock", TEE_SERVICE_REGISTRY);
    await registry.write.setMockResult(["0x0000000000000000000000000000000000000000", false]);

    const marketParams = {
        question: "Will it work?",
        oracleUrl: "https://example.com",
        jsonPath: "$.value",
        target: 100n,
        comparator: 0, // GT
        bettingSeconds: 60n,
        resolveDelaySeconds: 30n,
    };
    await market.write.createMarket([marketParams]);

    await networkHelpers.impersonateAccount(SCHEDULER);
    await networkHelpers.setBalance(SCHEDULER, 10n ** 18n);
    const schedulerClient = await viem.getWalletClient(SCHEDULER);

    try {
        await market.write.onScheduledResolve([0n, 1n], { account: schedulerClient.account });
        throw new Error("Should have reverted");
    } catch (e: any) {
        if (!e.message.includes("no TEE executor found")) {
            throw e;
        }
    }
  });
});