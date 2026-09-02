export const RITUAL_PREDICT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockTimeMs_",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isYes",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "closeBlock",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "resolveBlock",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "scheduleId",
        "type": "uint256"
      }
    ],
    "name": "MarketCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum RitualPredict.Outcome",
        "name": "outcome",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "observedValue",
        "type": "uint256"
      }
    ],
    "name": "MarketResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "MarketInvalidated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "WinningsClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "StakeRefunded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "question",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "oracleUrl",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "jsonPath",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "enum RitualPredict.Comparator",
            "name": "comparator",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "bettingSeconds",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "resolveDelaySeconds",
            "type": "uint256"
          }
        ],
        "internalType": "struct RitualPredict.NewMarket",
        "name": "p",
        "type": "tuple"
      }
    ],
    "name": "createMarket",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isYes",
        "type": "bool"
      }
    ],
    "name": "bet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      }
    ],
    "name": "claimWinnings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      }
    ],
    "name": "claimRefund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      }
    ],
    "name": "getMarket",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "question",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "oracleUrl",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "jsonPath",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "enum RitualPredict.Comparator",
            "name": "comparator",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "closeBlock",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "resolveBlock",
            "type": "uint64"
          },
          {
            "internalType": "uint256",
            "name": "scheduleId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalYes",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalNo",
            "type": "uint256"
          },
          {
            "internalType": "enum RitualPredict.MarketState",
            "name": "state",
            "type": "uint8"
          },
          {
            "internalType": "enum RitualPredict.Outcome",
            "name": "outcome",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "attempts",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "observedValue",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "invalidReason",
            "type": "string"
          }
        ],
        "internalType": "struct RitualPredict.Market",
        "name": "m",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMarkets",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "question",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "oracleUrl",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "jsonPath",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "enum RitualPredict.Comparator",
            "name": "comparator",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "closeBlock",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "resolveBlock",
            "type": "uint64"
          },
          {
            "internalType": "uint256",
            "name": "scheduleId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalYes",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalNo",
            "type": "uint256"
          },
          {
            "internalType": "enum RitualPredict.MarketState",
            "name": "state",
            "type": "uint8"
          },
          {
            "internalType": "enum RitualPredict.Outcome",
            "name": "outcome",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "attempts",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "observedValue",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "invalidReason",
            "type": "string"
          }
        ],
        "internalType": "struct RitualPredict.Market[]",
        "name": "all",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "stakesOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "yes",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "no",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "alreadySettled",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "claimable",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "marketCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "blockTimeMs",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
