import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// USDTMock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const usdtMockAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_MINT_PER_TRANSACTION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_recipients', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'bulkMintTestTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_weiAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'fromWei',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaxMintPerTransaction',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_recipient', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mintTestTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_recipient', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ownerMint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_humanAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'toWei',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipients',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'amounts',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'minter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BulkTokensMinted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'minter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TokensMinted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'USDTMock__ArrayLengthMismatch' },
  {
    type: 'error',
    inputs: [
      { name: 'requested', internalType: 'uint256', type: 'uint256' },
      { name: 'maximum', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'USDTMock__ExceedsMaxMint',
  },
  { type: 'error', inputs: [], name: 'USDTMock__InvalidArrayLength' },
  { type: 'error', inputs: [], name: 'USDTMock__ZeroAddress' },
  { type: 'error', inputs: [], name: 'USDTMock__ZeroAmount' },
] as const

/**
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const usdtMockAddress = {
  42421: '0x75803eaC2e855C03a17c1140f4bC0155a5067F6f',
} as const

/**
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const usdtMockConfig = {
  address: usdtMockAddress,
  abi: usdtMockAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZenovaAsset
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const zenovaAssetAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'AI_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'LIQUIDITY_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PRICE_AI_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'activateTrading',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'assetPricingDetails',
    outputs: [
      {
        name: 'currentPricePerToken',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'buyFeeBPS', internalType: 'uint256', type: 'uint256' },
      { name: 'sellFeeBPS', internalType: 'uint256', type: 'uint256' },
      { name: 'marketCap', internalType: 'uint256', type: 'uint256' },
      {
        name: 'lastPriceUpdateTimestamp',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'acceptedCurrency', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenAmountToBuy', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'buyTokens',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'collectedFees',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'companyInfo',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'website', internalType: 'string', type: 'string' },
      {
        name: 'issuingCompanyWallet',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amountOfTokens', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'companyWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentValuation',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deactivateTrading',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAssetPricingDetails',
    outputs: [
      {
        name: '',
        internalType: 'struct ZenovaAsset.AssetPricingDetails',
        type: 'tuple',
        components: [
          {
            name: 'currentPricePerToken',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'buyFeeBPS', internalType: 'uint256', type: 'uint256' },
          { name: 'sellFeeBPS', internalType: 'uint256', type: 'uint256' },
          { name: 'marketCap', internalType: 'uint256', type: 'uint256' },
          {
            name: 'lastPriceUpdateTimestamp',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'acceptedCurrency',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAssetSnapshot',
    outputs: [
      { name: 'currentPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'marketCap', internalType: 'uint256', type: 'uint256' },
      { name: 'contractBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'isTradingActive', internalType: 'bool', type: 'bool' },
      { name: 'lastPriceUpdate', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'getBuyQuote',
    outputs: [
      { name: 'totalCost', internalType: 'uint256', type: 'uint256' },
      { name: 'fee', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCollectedFees',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCompanyInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct ZenovaAsset.CompanyInfo',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'website', internalType: 'string', type: 'string' },
          {
            name: 'issuingCompanyWallet',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFullAssetDetails',
    outputs: [
      {
        name: 'info',
        internalType: 'struct ZenovaAsset.FullAssetDetails',
        type: 'tuple',
        components: [
          { name: 'assetAddress', internalType: 'address', type: 'address' },
          {
            name: 'companyDetails',
            internalType: 'struct ZenovaAsset.CompanyInfo',
            type: 'tuple',
            components: [
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'symbol', internalType: 'string', type: 'string' },
              { name: 'description', internalType: 'string', type: 'string' },
              { name: 'website', internalType: 'string', type: 'string' },
              {
                name: 'issuingCompanyWallet',
                internalType: 'address',
                type: 'address',
              },
            ],
          },
          {
            name: 'pricingDetails',
            internalType: 'struct ZenovaAsset.AssetPricingDetails',
            type: 'tuple',
            components: [
              {
                name: 'currentPricePerToken',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'buyFeeBPS', internalType: 'uint256', type: 'uint256' },
              { name: 'sellFeeBPS', internalType: 'uint256', type: 'uint256' },
              { name: 'marketCap', internalType: 'uint256', type: 'uint256' },
              {
                name: 'lastPriceUpdateTimestamp',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'acceptedCurrency',
                internalType: 'address',
                type: 'address',
              },
            ],
          },
          {
            name: 'currentValuation',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxTokenSupply', internalType: 'uint256', type: 'uint256' },
          {
            name: 'currentTotalSupply',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'isTradingActive', internalType: 'bool', type: 'bool' },
          { name: 'admin', internalType: 'address', type: 'address' },
          { name: 'priceAI', internalType: 'address', type: 'address' },
          {
            name: 'liquidityManager',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMarketAnalysis',
    outputs: [
      {
        name: 'analysis',
        internalType: 'struct ZenovaAsset.MarketAnalysis',
        type: 'tuple',
        components: [
          {
            name: 'currentMarketCap',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'fullyDilutedMarketCap',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'circulationRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'liquidityRatio', internalType: 'uint256', type: 'uint256' },
          {
            name: 'priceToValuationRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'isOvervalued', internalType: 'bool', type: 'bool' },
          { name: 'isUndervalued', internalType: 'bool', type: 'bool' },
          {
            name: 'timeSinceLastPriceUpdate',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRoleMember',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleMemberCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleMembers',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'getSellQuote',
    outputs: [
      { name: 'proceeds', internalType: 'uint256', type: 'uint256' },
      { name: 'fee', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTradingMetrics',
    outputs: [
      {
        name: 'metrics',
        internalType: 'struct ZenovaAsset.TradingMetrics',
        type: 'tuple',
        components: [
          {
            name: 'totalVolumeTraded',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalTokensTraded',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalBuyTransactions',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalSellTransactions',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalFeesCollected',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'averageTradeSize',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'lastTradeTimestamp',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'priceVolatility', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getUserAssetInfo',
    outputs: [
      {
        name: 'userInfo',
        internalType: 'struct ZenovaAsset.UserAssetInfo',
        type: 'tuple',
        components: [
          { name: 'tokenBalance', internalType: 'uint256', type: 'uint256' },
          {
            name: 'tokenBalanceValue',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'percentageOfSupply',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalPurchaseValue',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'totalSaleValue', internalType: 'uint256', type: 'uint256' },
          { name: 'totalFeesPaid', internalType: 'uint256', type: 'uint256' },
          {
            name: 'lastTradeTimestamp',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'hasTraded', internalType: 'bool', type: 'bool' },
          { name: 'realizedPnL', internalType: 'uint256', type: 'uint256' },
          { name: 'unrealizedPnL', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_initialAdmin', internalType: 'address', type: 'address' },
      {
        name: '_companyInfoStruct',
        internalType: 'struct ZenovaAsset.CompanyInfo',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'website', internalType: 'string', type: 'string' },
          {
            name: 'issuingCompanyWallet',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
      { name: '_acceptedCurrency', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isTradingActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastTradeTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxTokenSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenAmountToSell', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sellTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_companyValuation', internalType: 'uint256', type: 'uint256' },
      {
        name: '_initialPricePerToken',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_evaluator', internalType: 'address', type: 'address' },
    ],
    name: 'setCompanyValuationAndSupply',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalBuyTransactions',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSellTransactions',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalTokensTraded',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalVolumeTraded',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tradingActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newBuyFeeBPS', internalType: 'uint256', type: 'uint256' },
      { name: 'newSellFeeBPS', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateLiquidityParameters',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newPricePerToken', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updatePrice',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'userHasTraded',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'userLastTradeTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'userTotalFeesPaid',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'userTotalPurchaseValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'userTotalSaleValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'recipient', internalType: 'address', type: 'address' }],
    name: 'withdrawFees',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'valuation',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'maxSupply',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'evaluator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'CompanyValuationSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'buyFeeBPS',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'sellFeeBPS',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'updater',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'LiquidityParametersUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'updater',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'PriceUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'trader',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'isBuy', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'tokenAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'currencyAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'fee', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'TradeExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  { type: 'error', inputs: [], name: 'EnforcedPause' },
  { type: 'error', inputs: [], name: 'ExpectedPause' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'ZenovaAsset__AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'ZenovaAsset__CompanyWalletNotSet' },
  {
    type: 'error',
    inputs: [{ name: 'feeBPS', internalType: 'uint256', type: 'uint256' }],
    name: 'ZenovaAsset__FeeTooHigh',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ZenovaAsset__InsufficientAllowance',
  },
  { type: 'error', inputs: [], name: 'ZenovaAsset__InsufficientOutputAmount' },
  { type: 'error', inputs: [], name: 'ZenovaAsset__InvalidAmount' },
  { type: 'error', inputs: [], name: 'ZenovaAsset__MaxSupplyReached' },
  { type: 'error', inputs: [], name: 'ZenovaAsset__MaxSupplyWouldBeZero' },
  { type: 'error', inputs: [], name: 'ZenovaAsset__NoFeesToWithdraw' },
  { type: 'error', inputs: [], name: 'ZenovaAsset__NotAI' },
  { type: 'error', inputs: [], name: 'ZenovaAsset__NotInitialized' },
  { type: 'error', inputs: [], name: 'ZenovaAsset__PriceMustBePositive' },
  { type: 'error', inputs: [], name: 'ZenovaAsset__TradingActive' },
  { type: 'error', inputs: [], name: 'ZenovaAsset__TradingNotActive' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ZenovaAsset__TransferFailed',
  },
  { type: 'error', inputs: [], name: 'ZenovaAsset__ValuationNotSet' },
  { type: 'error', inputs: [], name: 'ZenovaAsset__ValuationZeroOrPriceZero' },
  {
    type: 'error',
    inputs: [],
    name: 'ZenovaAsset__WithdrawAmountExceedsBalance',
  },
  { type: 'error', inputs: [], name: 'ZenovaAsset__ZeroAddress' },
] as const

/**
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const zenovaAssetAddress = {
  42421: '0xDe06ca34EA978e7361C3c27e31F082f2996606a5',
} as const

/**
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const zenovaAssetConfig = {
  address: zenovaAssetAddress,
  abi: zenovaAssetAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZenovaAssetFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const zenovaAssetFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_assetImplementation',
        internalType: 'address',
        type: 'address',
      },
      {
        name: '_acceptedCurrencyAddr',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'AI_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'acceptedCurrency',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'allZenovaAssets',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'assetInitialValuations',
    outputs: [
      { name: 'companyWallet', internalType: 'address', type: 'address' },
      { name: 'valuation', internalType: 'uint256', type: 'uint256' },
      {
        name: 'initialPricePerToken',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'evaluatorAI', internalType: 'address', type: 'address' },
      { name: 'assessmentTimestamp', internalType: 'uint64', type: 'uint64' },
      { name: 'exists', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'companyToAssets',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_companyWallet', internalType: 'address', type: 'address' },
      {
        name: '_companyInfo',
        internalType: 'struct ZenovaAsset.CompanyInfo',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'website', internalType: 'string', type: 'string' },
          {
            name: 'issuingCompanyWallet',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    name: 'createZenovaAsset',
    outputs: [
      { name: 'assetAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllAssets',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_assetAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getAssetFullDetails',
    outputs: [
      {
        name: '',
        internalType: 'struct ZenovaAsset.FullAssetDetails',
        type: 'tuple',
        components: [
          { name: 'assetAddress', internalType: 'address', type: 'address' },
          {
            name: 'companyDetails',
            internalType: 'struct ZenovaAsset.CompanyInfo',
            type: 'tuple',
            components: [
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'symbol', internalType: 'string', type: 'string' },
              { name: 'description', internalType: 'string', type: 'string' },
              { name: 'website', internalType: 'string', type: 'string' },
              {
                name: 'issuingCompanyWallet',
                internalType: 'address',
                type: 'address',
              },
            ],
          },
          {
            name: 'pricingDetails',
            internalType: 'struct ZenovaAsset.AssetPricingDetails',
            type: 'tuple',
            components: [
              {
                name: 'currentPricePerToken',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'buyFeeBPS', internalType: 'uint256', type: 'uint256' },
              { name: 'sellFeeBPS', internalType: 'uint256', type: 'uint256' },
              { name: 'marketCap', internalType: 'uint256', type: 'uint256' },
              {
                name: 'lastPriceUpdateTimestamp',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'acceptedCurrency',
                internalType: 'address',
                type: 'address',
              },
            ],
          },
          {
            name: 'currentValuation',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxTokenSupply', internalType: 'uint256', type: 'uint256' },
          {
            name: 'currentTotalSupply',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'isTradingActive', internalType: 'bool', type: 'bool' },
          { name: 'admin', internalType: 'address', type: 'address' },
          { name: 'priceAI', internalType: 'address', type: 'address' },
          {
            name: 'liquidityManager',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_companyWallet', internalType: 'address', type: 'address' },
    ],
    name: 'getAssetsByCompany',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_companyWallet', internalType: 'address', type: 'address' },
    ],
    name: 'getCompanyComprehensiveDetails',
    outputs: [
      {
        name: 'details',
        internalType: 'struct ZenovaAssetFactory.CompanyComprehensiveDetails',
        type: 'tuple',
        components: [
          { name: 'companyWallet', internalType: 'address', type: 'address' },
          {
            name: 'pendingValuation',
            internalType: 'struct ZenovaAssetFactory.CompanyInitialValuation',
            type: 'tuple',
            components: [
              {
                name: 'companyWallet',
                internalType: 'address',
                type: 'address',
              },
              { name: 'valuation', internalType: 'uint256', type: 'uint256' },
              {
                name: 'initialPricePerToken',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'evaluatorAI', internalType: 'address', type: 'address' },
              {
                name: 'assessmentTimestamp',
                internalType: 'uint64',
                type: 'uint64',
              },
              { name: 'exists', internalType: 'bool', type: 'bool' },
            ],
          },
          {
            name: 'assetAddresses',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'assetDetails',
            internalType: 'struct ZenovaAsset.FullAssetDetails[]',
            type: 'tuple[]',
            components: [
              {
                name: 'assetAddress',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'companyDetails',
                internalType: 'struct ZenovaAsset.CompanyInfo',
                type: 'tuple',
                components: [
                  { name: 'name', internalType: 'string', type: 'string' },
                  { name: 'symbol', internalType: 'string', type: 'string' },
                  {
                    name: 'description',
                    internalType: 'string',
                    type: 'string',
                  },
                  { name: 'website', internalType: 'string', type: 'string' },
                  {
                    name: 'issuingCompanyWallet',
                    internalType: 'address',
                    type: 'address',
                  },
                ],
              },
              {
                name: 'pricingDetails',
                internalType: 'struct ZenovaAsset.AssetPricingDetails',
                type: 'tuple',
                components: [
                  {
                    name: 'currentPricePerToken',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'buyFeeBPS',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'sellFeeBPS',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'marketCap',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'lastPriceUpdateTimestamp',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'acceptedCurrency',
                    internalType: 'address',
                    type: 'address',
                  },
                ],
              },
              {
                name: 'currentValuation',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxTokenSupply',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'currentTotalSupply',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'isTradingActive', internalType: 'bool', type: 'bool' },
              { name: 'admin', internalType: 'address', type: 'address' },
              { name: 'priceAI', internalType: 'address', type: 'address' },
              {
                name: 'liquidityManager',
                internalType: 'address',
                type: 'address',
              },
            ],
          },
          { name: 'totalMarketCap', internalType: 'uint256', type: 'uint256' },
          {
            name: 'totalTokensIssued',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalTradingVolume',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'hasActiveAssets', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_assetAddresses', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'getMultipleAssetAnalytics',
    outputs: [
      {
        name: 'assetDetails',
        internalType: 'struct ZenovaAsset.FullAssetDetails[]',
        type: 'tuple[]',
        components: [
          { name: 'assetAddress', internalType: 'address', type: 'address' },
          {
            name: 'companyDetails',
            internalType: 'struct ZenovaAsset.CompanyInfo',
            type: 'tuple',
            components: [
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'symbol', internalType: 'string', type: 'string' },
              { name: 'description', internalType: 'string', type: 'string' },
              { name: 'website', internalType: 'string', type: 'string' },
              {
                name: 'issuingCompanyWallet',
                internalType: 'address',
                type: 'address',
              },
            ],
          },
          {
            name: 'pricingDetails',
            internalType: 'struct ZenovaAsset.AssetPricingDetails',
            type: 'tuple',
            components: [
              {
                name: 'currentPricePerToken',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'buyFeeBPS', internalType: 'uint256', type: 'uint256' },
              { name: 'sellFeeBPS', internalType: 'uint256', type: 'uint256' },
              { name: 'marketCap', internalType: 'uint256', type: 'uint256' },
              {
                name: 'lastPriceUpdateTimestamp',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'acceptedCurrency',
                internalType: 'address',
                type: 'address',
              },
            ],
          },
          {
            name: 'currentValuation',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxTokenSupply', internalType: 'uint256', type: 'uint256' },
          {
            name: 'currentTotalSupply',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'isTradingActive', internalType: 'bool', type: 'bool' },
          { name: 'admin', internalType: 'address', type: 'address' },
          { name: 'priceAI', internalType: 'address', type: 'address' },
          {
            name: 'liquidityManager',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
      {
        name: 'tradingMetrics',
        internalType: 'struct ZenovaAsset.TradingMetrics[]',
        type: 'tuple[]',
        components: [
          {
            name: 'totalVolumeTraded',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalTokensTraded',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalBuyTransactions',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalSellTransactions',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalFeesCollected',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'averageTradeSize',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'lastTradeTimestamp',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'priceVolatility', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'marketAnalysis',
        internalType: 'struct ZenovaAsset.MarketAnalysis[]',
        type: 'tuple[]',
        components: [
          {
            name: 'currentMarketCap',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'fullyDilutedMarketCap',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'circulationRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'liquidityRatio', internalType: 'uint256', type: 'uint256' },
          {
            name: 'priceToValuationRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'isOvervalued', internalType: 'bool', type: 'bool' },
          { name: 'isUndervalued', internalType: 'bool', type: 'bool' },
          {
            name: 'timeSinceLastPriceUpdate',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_assetAddresses', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'getMultipleAssetFullDetails',
    outputs: [
      {
        name: '',
        internalType: 'struct ZenovaAsset.FullAssetDetails[]',
        type: 'tuple[]',
        components: [
          { name: 'assetAddress', internalType: 'address', type: 'address' },
          {
            name: 'companyDetails',
            internalType: 'struct ZenovaAsset.CompanyInfo',
            type: 'tuple',
            components: [
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'symbol', internalType: 'string', type: 'string' },
              { name: 'description', internalType: 'string', type: 'string' },
              { name: 'website', internalType: 'string', type: 'string' },
              {
                name: 'issuingCompanyWallet',
                internalType: 'address',
                type: 'address',
              },
            ],
          },
          {
            name: 'pricingDetails',
            internalType: 'struct ZenovaAsset.AssetPricingDetails',
            type: 'tuple',
            components: [
              {
                name: 'currentPricePerToken',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'buyFeeBPS', internalType: 'uint256', type: 'uint256' },
              { name: 'sellFeeBPS', internalType: 'uint256', type: 'uint256' },
              { name: 'marketCap', internalType: 'uint256', type: 'uint256' },
              {
                name: 'lastPriceUpdateTimestamp',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'acceptedCurrency',
                internalType: 'address',
                type: 'address',
              },
            ],
          },
          {
            name: 'currentValuation',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxTokenSupply', internalType: 'uint256', type: 'uint256' },
          {
            name: 'currentTotalSupply',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'isTradingActive', internalType: 'bool', type: 'bool' },
          { name: 'admin', internalType: 'address', type: 'address' },
          { name: 'priceAI', internalType: 'address', type: 'address' },
          {
            name: 'liquidityManager',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPlatformSnapshot',
    outputs: [
      {
        name: 'snapshot',
        internalType: 'struct ZenovaAssetFactory.PlatformSnapshot',
        type: 'tuple',
        components: [
          {
            name: 'totalAssetsCreated',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalCompaniesOnboarded',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalActiveAssets',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalMarketCapitalization',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalTradingVolume',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalFeesCollected',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'averageAssetMarketCap',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalTokensInCirculation',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalMaxTokenSupply',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'largestAssetByMarketCap',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'mostActiveAssetByVolume',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_companyWallet', internalType: 'address', type: 'address' },
    ],
    name: 'getSubmittedValuation',
    outputs: [
      {
        name: '',
        internalType: 'struct ZenovaAssetFactory.CompanyInitialValuation',
        type: 'tuple',
        components: [
          { name: 'companyWallet', internalType: 'address', type: 'address' },
          { name: 'valuation', internalType: 'uint256', type: 'uint256' },
          {
            name: 'initialPricePerToken',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'evaluatorAI', internalType: 'address', type: 'address' },
          {
            name: 'assessmentTimestamp',
            internalType: 'uint64',
            type: 'uint64',
          },
          { name: 'exists', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'getUserPortfolioDetails',
    outputs: [
      {
        name: 'portfolio',
        internalType: 'struct ZenovaAssetFactory.UserPortfolioDetails',
        type: 'tuple',
        components: [
          { name: 'userAddress', internalType: 'address', type: 'address' },
          {
            name: 'totalPortfolioValue',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalInvestedAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalRealizedPnL',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalUnrealizedPnL',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'totalFeesPaid', internalType: 'uint256', type: 'uint256' },
          {
            name: 'numberOfAssetsHeld',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'heldAssetAddresses',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'assetHoldings',
            internalType: 'struct ZenovaAsset.UserAssetInfo[]',
            type: 'tuple[]',
            components: [
              {
                name: 'tokenBalance',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'tokenBalanceValue',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'percentageOfSupply',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'totalPurchaseValue',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'totalSaleValue',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'totalFeesPaid',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'lastTradeTimestamp',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'hasTraded', internalType: 'bool', type: 'bool' },
              { name: 'realizedPnL', internalType: 'uint256', type: 'uint256' },
              {
                name: 'unrealizedPnL',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
          { name: 'isActiveTrader', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_companyWallet', internalType: 'address', type: 'address' },
      { name: '_valuation', internalType: 'uint256', type: 'uint256' },
      {
        name: '_initialPricePerToken',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'submitCompanyValuation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalAssets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'zenovaAssetImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'companyWallet',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'valuation',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'initialPricePerToken',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'evaluatorAI',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'CompanyValuationSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'assetAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'companyWallet',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'companyName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'initialValuation',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'maxTokenSupply',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ZenovaAssetCreated',
  },
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'Factory__AssetCreationFailed' },
  { type: 'error', inputs: [], name: 'Factory__ImplementationNotSet' },
  { type: 'error', inputs: [], name: 'Factory__InvalidAmount' },
  { type: 'error', inputs: [], name: 'Factory__NotAI' },
  { type: 'error', inputs: [], name: 'Factory__NotAuthorized' },
  { type: 'error', inputs: [], name: 'Factory__NotCompanyWallet' },
  { type: 'error', inputs: [], name: 'Factory__PriceCannotBeZero' },
  { type: 'error', inputs: [], name: 'Factory__ValuationAlreadyExists' },
  { type: 'error', inputs: [], name: 'Factory__ValuationNotFound' },
  { type: 'error', inputs: [], name: 'Factory__ZeroAddress' },
  { type: 'error', inputs: [], name: 'FailedDeployment' },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
] as const

/**
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const zenovaAssetFactoryAddress = {
  42421: '0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3',
} as const

/**
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const zenovaAssetFactoryConfig = {
  address: zenovaAssetFactoryAddress,
  abi: zenovaAssetFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdtMockAbi}__
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useReadUsdtMock = /*#__PURE__*/ createUseReadContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"MAX_MINT_PER_TRANSACTION"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useReadUsdtMockMaxMintPerTransaction =
  /*#__PURE__*/ createUseReadContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'MAX_MINT_PER_TRANSACTION',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"allowance"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useReadUsdtMockAllowance = /*#__PURE__*/ createUseReadContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"balanceOf"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useReadUsdtMockBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"decimals"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useReadUsdtMockDecimals = /*#__PURE__*/ createUseReadContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"fromWei"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useReadUsdtMockFromWei = /*#__PURE__*/ createUseReadContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'fromWei',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"getMaxMintPerTransaction"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useReadUsdtMockGetMaxMintPerTransaction =
  /*#__PURE__*/ createUseReadContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'getMaxMintPerTransaction',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"name"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useReadUsdtMockName = /*#__PURE__*/ createUseReadContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"owner"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useReadUsdtMockOwner = /*#__PURE__*/ createUseReadContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"symbol"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useReadUsdtMockSymbol = /*#__PURE__*/ createUseReadContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"toWei"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useReadUsdtMockToWei = /*#__PURE__*/ createUseReadContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'toWei',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"totalSupply"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useReadUsdtMockTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdtMockAbi}__
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWriteUsdtMock = /*#__PURE__*/ createUseWriteContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWriteUsdtMockApprove = /*#__PURE__*/ createUseWriteContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"bulkMintTestTokens"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWriteUsdtMockBulkMintTestTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'bulkMintTestTokens',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"burn"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWriteUsdtMockBurn = /*#__PURE__*/ createUseWriteContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"mintTestTokens"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWriteUsdtMockMintTestTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'mintTestTokens',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"ownerMint"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWriteUsdtMockOwnerMint = /*#__PURE__*/ createUseWriteContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'ownerMint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWriteUsdtMockRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWriteUsdtMockTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWriteUsdtMockTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWriteUsdtMockTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdtMockAbi}__
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useSimulateUsdtMock = /*#__PURE__*/ createUseSimulateContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useSimulateUsdtMockApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"bulkMintTestTokens"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useSimulateUsdtMockBulkMintTestTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'bulkMintTestTokens',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"burn"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useSimulateUsdtMockBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: usdtMockAbi,
  address: usdtMockAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"mintTestTokens"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useSimulateUsdtMockMintTestTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'mintTestTokens',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"ownerMint"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useSimulateUsdtMockOwnerMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'ownerMint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useSimulateUsdtMockRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useSimulateUsdtMockTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useSimulateUsdtMockTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdtMockAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useSimulateUsdtMockTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdtMockAbi}__
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWatchUsdtMockEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdtMockAbi,
  address: usdtMockAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdtMockAbi}__ and `eventName` set to `"Approval"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWatchUsdtMockApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdtMockAbi}__ and `eventName` set to `"BulkTokensMinted"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWatchUsdtMockBulkTokensMintedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    eventName: 'BulkTokensMinted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdtMockAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWatchUsdtMockOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdtMockAbi}__ and `eventName` set to `"TokensMinted"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWatchUsdtMockTokensMintedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    eventName: 'TokensMinted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdtMockAbi}__ and `eventName` set to `"Transfer"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x75803eaC2e855C03a17c1140f4bC0155a5067F6f)
 */
export const useWatchUsdtMockTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: usdtMockAbi,
    address: usdtMockAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAsset = /*#__PURE__*/ createUseReadContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"AI_ROLE"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetAiRole = /*#__PURE__*/ createUseReadContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
  functionName: 'AI_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetDefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"LIQUIDITY_MANAGER_ROLE"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetLiquidityManagerRole =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'LIQUIDITY_MANAGER_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"PRICE_AI_ROLE"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetPriceAiRole =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'PRICE_AI_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"allowance"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetAllowance = /*#__PURE__*/ createUseReadContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"assetPricingDetails"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetAssetPricingDetails =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'assetPricingDetails',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"balanceOf"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"collectedFees"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetCollectedFees =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'collectedFees',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"companyInfo"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetCompanyInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'companyInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"currentValuation"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetCurrentValuation =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'currentValuation',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"decimals"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetDecimals = /*#__PURE__*/ createUseReadContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getAssetPricingDetails"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetAssetPricingDetails =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getAssetPricingDetails',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getAssetSnapshot"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetAssetSnapshot =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getAssetSnapshot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getBuyQuote"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetBuyQuote =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getBuyQuote',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getCollectedFees"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetCollectedFees =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getCollectedFees',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getCompanyInfo"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetCompanyInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getCompanyInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getFullAssetDetails"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetFullAssetDetails =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getFullAssetDetails',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getMarketAnalysis"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetMarketAnalysis =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getMarketAnalysis',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getRoleAdmin"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getRoleMember"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetRoleMember =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getRoleMember',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getRoleMemberCount"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetRoleMemberCount =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getRoleMemberCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getRoleMembers"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetRoleMembers =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getRoleMembers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getSellQuote"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetSellQuote =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getSellQuote',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getTradingMetrics"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetTradingMetrics =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getTradingMetrics',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"getUserAssetInfo"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetGetUserAssetInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'getUserAssetInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"hasRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetHasRole = /*#__PURE__*/ createUseReadContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"isTradingActive"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetIsTradingActive =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'isTradingActive',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"lastTradeTimestamp"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetLastTradeTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'lastTradeTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"maxTokenSupply"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetMaxTokenSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'maxTokenSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"name"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetName = /*#__PURE__*/ createUseReadContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"paused"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetPaused = /*#__PURE__*/ createUseReadContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"symbol"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetSymbol = /*#__PURE__*/ createUseReadContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"totalBuyTransactions"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetTotalBuyTransactions =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'totalBuyTransactions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"totalSellTransactions"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetTotalSellTransactions =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'totalSellTransactions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"totalSupply"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"totalTokensTraded"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetTotalTokensTraded =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'totalTokensTraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"totalVolumeTraded"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetTotalVolumeTraded =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'totalVolumeTraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"tradingActive"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetTradingActive =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'tradingActive',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"userHasTraded"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetUserHasTraded =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'userHasTraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"userLastTradeTimestamp"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetUserLastTradeTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'userLastTradeTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"userTotalFeesPaid"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetUserTotalFeesPaid =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'userTotalFeesPaid',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"userTotalPurchaseValue"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetUserTotalPurchaseValue =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'userTotalPurchaseValue',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"userTotalSaleValue"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useReadZenovaAssetUserTotalSaleValue =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'userTotalSaleValue',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAsset = /*#__PURE__*/ createUseWriteContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"activateTrading"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetActivateTrading =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'activateTrading',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetApprove = /*#__PURE__*/ createUseWriteContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"buyTokens"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetBuyTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'buyTokens',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"companyWithdraw"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetCompanyWithdraw =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'companyWithdraw',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"deactivateTrading"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetDeactivateTrading =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'deactivateTrading',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"grantRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"initialize"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"pause"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetPause = /*#__PURE__*/ createUseWriteContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"renounceRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"revokeRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"sellTokens"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetSellTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'sellTokens',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"setCompanyValuationAndSupply"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetSetCompanyValuationAndSupply =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'setCompanyValuationAndSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetTransfer = /*#__PURE__*/ createUseWriteContract(
  {
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'transfer',
  },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"unpause"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"updateLiquidityParameters"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetUpdateLiquidityParameters =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'updateLiquidityParameters',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"updatePrice"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetUpdatePrice =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'updatePrice',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"withdrawFees"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWriteZenovaAssetWithdrawFees =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'withdrawFees',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAsset = /*#__PURE__*/ createUseSimulateContract({
  abi: zenovaAssetAbi,
  address: zenovaAssetAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"activateTrading"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetActivateTrading =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'activateTrading',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"buyTokens"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetBuyTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'buyTokens',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"companyWithdraw"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetCompanyWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'companyWithdraw',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"deactivateTrading"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetDeactivateTrading =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'deactivateTrading',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"grantRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"initialize"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"pause"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetPause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"renounceRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"revokeRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"sellTokens"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetSellTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'sellTokens',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"setCompanyValuationAndSupply"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetSetCompanyValuationAndSupply =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'setCompanyValuationAndSupply',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"unpause"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetUnpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"updateLiquidityParameters"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetUpdateLiquidityParameters =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'updateLiquidityParameters',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"updatePrice"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetUpdatePrice =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'updatePrice',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetAbi}__ and `functionName` set to `"withdrawFees"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useSimulateZenovaAssetWithdrawFees =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    functionName: 'withdrawFees',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetAbi}__
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWatchZenovaAssetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetAbi}__ and `eventName` set to `"Approval"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWatchZenovaAssetApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetAbi}__ and `eventName` set to `"CompanyValuationSet"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWatchZenovaAssetCompanyValuationSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    eventName: 'CompanyValuationSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetAbi}__ and `eventName` set to `"LiquidityParametersUpdated"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWatchZenovaAssetLiquidityParametersUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    eventName: 'LiquidityParametersUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetAbi}__ and `eventName` set to `"Paused"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWatchZenovaAssetPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetAbi}__ and `eventName` set to `"PriceUpdated"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWatchZenovaAssetPriceUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    eventName: 'PriceUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetAbi}__ and `eventName` set to `"RoleAdminChanged"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWatchZenovaAssetRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetAbi}__ and `eventName` set to `"RoleGranted"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWatchZenovaAssetRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetAbi}__ and `eventName` set to `"RoleRevoked"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWatchZenovaAssetRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetAbi}__ and `eventName` set to `"TradeExecuted"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWatchZenovaAssetTradeExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    eventName: 'TradeExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetAbi}__ and `eventName` set to `"Transfer"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWatchZenovaAssetTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetAbi}__ and `eventName` set to `"Unpaused"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0xDe06ca34EA978e7361C3c27e31F082f2996606a5)
 */
export const useWatchZenovaAssetUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetAbi,
    address: zenovaAssetAddress,
    eventName: 'Unpaused',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactory = /*#__PURE__*/ createUseReadContract({
  abi: zenovaAssetFactoryAbi,
  address: zenovaAssetFactoryAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"AI_ROLE"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryAiRole =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'AI_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryDefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"acceptedCurrency"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryAcceptedCurrency =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'acceptedCurrency',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"allZenovaAssets"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryAllZenovaAssets =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'allZenovaAssets',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"assetInitialValuations"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryAssetInitialValuations =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'assetInitialValuations',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"companyToAssets"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryCompanyToAssets =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'companyToAssets',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"getAllAssets"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryGetAllAssets =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'getAllAssets',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"getAssetFullDetails"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryGetAssetFullDetails =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'getAssetFullDetails',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"getAssetsByCompany"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryGetAssetsByCompany =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'getAssetsByCompany',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"getCompanyComprehensiveDetails"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryGetCompanyComprehensiveDetails =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'getCompanyComprehensiveDetails',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"getMultipleAssetAnalytics"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryGetMultipleAssetAnalytics =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'getMultipleAssetAnalytics',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"getMultipleAssetFullDetails"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryGetMultipleAssetFullDetails =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'getMultipleAssetFullDetails',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"getPlatformSnapshot"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryGetPlatformSnapshot =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'getPlatformSnapshot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"getRoleAdmin"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryGetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'getRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"getSubmittedValuation"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryGetSubmittedValuation =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'getSubmittedValuation',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"getUserPortfolioDetails"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryGetUserPortfolioDetails =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'getUserPortfolioDetails',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"hasRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryHasRole =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'hasRole',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactorySupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"totalAssets"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryTotalAssets =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'totalAssets',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"zenovaAssetImplementation"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useReadZenovaAssetFactoryZenovaAssetImplementation =
  /*#__PURE__*/ createUseReadContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'zenovaAssetImplementation',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useWriteZenovaAssetFactory = /*#__PURE__*/ createUseWriteContract({
  abi: zenovaAssetFactoryAbi,
  address: zenovaAssetFactoryAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"createZenovaAsset"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useWriteZenovaAssetFactoryCreateZenovaAsset =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'createZenovaAsset',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"grantRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useWriteZenovaAssetFactoryGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"renounceRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useWriteZenovaAssetFactoryRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"revokeRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useWriteZenovaAssetFactoryRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"submitCompanyValuation"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useWriteZenovaAssetFactorySubmitCompanyValuation =
  /*#__PURE__*/ createUseWriteContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'submitCompanyValuation',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useSimulateZenovaAssetFactory =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"createZenovaAsset"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useSimulateZenovaAssetFactoryCreateZenovaAsset =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'createZenovaAsset',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"grantRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useSimulateZenovaAssetFactoryGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"renounceRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useSimulateZenovaAssetFactoryRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"revokeRole"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useSimulateZenovaAssetFactoryRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `functionName` set to `"submitCompanyValuation"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useSimulateZenovaAssetFactorySubmitCompanyValuation =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    functionName: 'submitCompanyValuation',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useWatchZenovaAssetFactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `eventName` set to `"CompanyValuationSubmitted"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useWatchZenovaAssetFactoryCompanyValuationSubmittedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    eventName: 'CompanyValuationSubmitted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `eventName` set to `"RoleAdminChanged"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useWatchZenovaAssetFactoryRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `eventName` set to `"RoleGranted"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useWatchZenovaAssetFactoryRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `eventName` set to `"RoleRevoked"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useWatchZenovaAssetFactoryRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zenovaAssetFactoryAbi}__ and `eventName` set to `"ZenovaAssetCreated"`
 *
 * [__View Contract on Asset Chain Testnet Asset Chain Testnet Explorer__](https://scan-testnet.assetchain.org/address/0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3)
 */
export const useWatchZenovaAssetFactoryZenovaAssetCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zenovaAssetFactoryAbi,
    address: zenovaAssetFactoryAddress,
    eventName: 'ZenovaAssetCreated',
  })
