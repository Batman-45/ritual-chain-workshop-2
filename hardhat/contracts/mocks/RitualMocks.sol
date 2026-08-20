// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { IScheduler, IRitualWallet, ITEEServiceRegistry } from "../ritual/RitualChain.sol";

contract SchedulerMock is IScheduler {
    function schedule(
        bytes calldata,
        uint32,
        uint32,
        uint32,
        uint32,
        uint32,
        uint256,
        uint256,
        uint256,
        address
    ) external pure returns (uint256) {
        return 1;
    }

    function cancel(uint256) external pure {}

    function getCallState(uint256) external pure returns (uint8) {
        return 0;
    }

    function approveScheduler(address) external pure {}
}

contract HttpPrecompileMock {
    bytes public mockOutput;

    function setMockOutput(bytes calldata output) external {
        mockOutput = output;
    }

    function setMockResult(bytes calldata empty, bytes calldata actualOutput) external {
        mockOutput = abi.encode(empty, actualOutput);
    }

    fallback() external {
        bytes memory data = mockOutput;
        assembly {
            return(add(data, 0x20), mload(data))
        }
    }
}

contract RitualWalletMock is IRitualWallet {
    function deposit(uint256) external payable {}
    function balanceOf(address) external pure returns (uint256) { return 0; }
    function lockUntil(address) external pure returns (uint256) { return 0; }
}

contract TEEServiceRegistryMock is ITEEServiceRegistry {
    address public mockTeeAddress;
    bool public mockFound;

    function setMockResult(address addr, bool found) external {
        mockTeeAddress = addr;
        mockFound = found;
    }

    function pickServiceByCapability(uint8, bool, uint256, uint256) external view returns (address, bool) {
        return (mockTeeAddress, mockFound);
    }
}
