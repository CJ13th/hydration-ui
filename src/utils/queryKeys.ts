import type { u32 } from "@polkadot/types"
import { u128 } from "@polkadot/types-codec"
import type { AccountId32 } from "@polkadot/types/interfaces"
import { CodecHash } from "@polkadot/types/interfaces/runtime"
import { StatsTimeframe } from "api/stats"
import type BigNumber from "bignumber.js"
import { Maybe } from "utils/helpers"
import { ChartType } from "sections/stats/components/ChartsWrapper/ChartsWrapper"

export const QUERY_KEY_PREFIX = "@block"

export const QUERY_KEYS = {
  assets: (rpc: string) => ["assets", rpc],
  bondsAssets: ["bondsAssets"],
  providerAccounts: (provider: string | undefined) => [
    "web3Accounts",
    provider,
  ],
  walletEnable: (provider: string | null) => ["web3Enable", provider],
  bestNumber: (ws: string) => [QUERY_KEY_PREFIX, "bestNumber", ws],
  assetsTable: (id: Maybe<AccountId32 | string>) => [
    QUERY_KEY_PREFIX,
    "assetsTable",
    id?.toString(),
  ],
  miningPosition: (id: string) => ["miningPosition", id],
  miningPositionXYK: (id: string) => ["miningPositionXYK", id],
  accountBalancesLive: (id: Maybe<AccountId32 | string>) => [
    QUERY_KEY_PREFIX,
    "accountBalances",
    id?.toString(),
  ],
  accountBalances: (id: Maybe<AccountId32 | string>) => [
    "accountBalances",
    id?.toString(),
  ],
  accountAssets: (address: string | undefined) => [
    QUERY_KEY_PREFIX,
    "accountAssets",
    address,
  ],
  accountClaimableFarmValues: (address: string | undefined, range: string) => [
    "accountClaimableFarmValues",
    address,
    range,
  ],
  accountsBalances: (ids: string[]) => [
    QUERY_KEY_PREFIX,
    "accountsBalances",
    ids.join("."),
  ],
  pools: [QUERY_KEY_PREFIX, "pools"],
  poolShareToken: (poolId: AccountId32 | string) => [
    QUERY_KEY_PREFIX,
    "poolShareToken",
    poolId.toString(),
  ],
  dynamicAssetFee: (id: Maybe<u32 | string>) => [
    "dynamicAssetFee",
    id?.toString(),
  ],
  deposit: (id: Maybe<u128>) => [QUERY_KEY_PREFIX, "deposit", id?.toString()],
  allXYKDeposits: [QUERY_KEY_PREFIX, "allXYKDeposits"],
  omnipoolDeposits: (ids: string[]) => [
    QUERY_KEY_PREFIX,
    "omnipoolDeposits",
    ids.join("."),
  ],
  omnipoolMinLiquidity: ["omnipoolMinLiquidity"],
  xykDeposits: (ids: string[]) => [
    QUERY_KEY_PREFIX,
    "xykDeposits",
    ids.join("."),
  ],
  poolDeposits: (poolId: Maybe<u32 | string>) => [
    QUERY_KEY_PREFIX,
    "deposits",
    poolId?.toString(),
  ],
  omnipoolActiveFarms: ["omnipoolActiveFarms"],
  omnipoolFarms: [QUERY_KEY_PREFIX, "omnipoolFarms"],
  xykActiveFarms: ["xykActiveFarms"],
  xykFarms: [QUERY_KEY_PREFIX, "xykFarms"],
  totalIssuances: ["totalIssuances"],
  reserves: (id: Maybe<string | u32>, address: Maybe<AccountId32 | string>) => [
    QUERY_KEY_PREFIX,
    "reserves",
    id?.toString(),
    address,
  ],
  tokenBalance: (
    id: Maybe<string | u32>,
    address: Maybe<AccountId32 | string>,
  ) => ["tokenBalance", id?.toString(), address],
  tokenBalanceLive: (
    id: Maybe<string | u32>,
    address: Maybe<AccountId32 | string>,
  ) => [QUERY_KEY_PREFIX, "tokenBalance", id?.toString(), address],
  tokensBalances: (ids: string[], address?: string) => [
    QUERY_KEY_PREFIX,
    "tokenBalances",
    address,
    ...ids,
  ],
  exchangeFee: [QUERY_KEY_PREFIX, "exchangeFee"],
  calculateTotalLiqInPools: [QUERY_KEY_PREFIX, "totalLiqInPools"],
  spotPrice: (assetA: string, assetB: string) => ["spotPrice", assetA, assetB],
  spotPriceLive: (assetA: string, assetB: string) => [
    QUERY_KEY_PREFIX,
    "spotPrice",
    assetA,
    assetB,
  ],
  oraclePrice: (
    rewardCurrency: Maybe<string>,
    incentivizedAsset: Maybe<string>,
  ) => [QUERY_KEY_PREFIX, "oraclePrice", rewardCurrency, incentivizedAsset],
  paymentInfo: (hash: CodecHash, account?: AccountId32 | string) => [
    QUERY_KEY_PREFIX,
    "paymentInfo",
    hash,
    account,
  ],
  nextNonce: (account: Maybe<AccountId32 | string>) => [
    QUERY_KEY_PREFIX,
    "nonce",
    account,
  ],
  nextEvmPermitNonce: (account: Maybe<AccountId32 | string>) => [
    "evmPermitNonce",
    account?.toString(),
  ],
  pendingEvmPermit: (account: Maybe<AccountId32 | string>) => [
    "pendingEvmPermit",
    account?.toString(),
  ],
  mathLoyaltyRates: (
    plannedYieldingPeriods: string,
    initialRewardPercentage: Maybe<string>,
    scaleCoef: Maybe<string>,
    periodsInFarm: Maybe<string>,
  ) => [
    "mathLoyaltyRates",
    plannedYieldingPeriods,
    initialRewardPercentage?.toString(),
    scaleCoef?.toString(),
    periodsInFarm,
  ],
  minWithdrawalFee: ["minWithdrawalFee"],
  allTrades: (assetId?: number) => ["allTrades", assetId],
  allOmnipoolTrades: ["allOmnipoolTrades"],
  allStableswapTrades: ["allStableswapTrades"],
  xykSquidVolumes: (addresses: string[]) => [
    "xykSquidVolumes",
    addresses.join(","),
  ],
  timestamp: (bestNumber: Maybe<u32 | BigNumber>) =>
    bestNumber != null
      ? ["timestamp", bestNumber]
      : [QUERY_KEY_PREFIX, "timestamp"],
  vestingSchedules: (address: Maybe<AccountId32 | string>) => [
    QUERY_KEY_PREFIX,
    "vestingSchedules",
    address,
  ],
  vestingLockBalance: (address: Maybe<AccountId32 | string>) => [
    QUERY_KEY_PREFIX,
    "vestingLock",
    address,
  ],
  lock: (address: Maybe<AccountId32 | string>, asset: Maybe<u32 | string>) => [
    QUERY_KEY_PREFIX,
    "lock",
    address,
    asset,
  ],
  hubAssetImbalance: () => ["hubAssetImbalance"],
  omnipoolFee: ["omnipoolFee"],
  omnipoolPositions: [QUERY_KEY_PREFIX, "omnipoolPositions"],
  allOmnipoolPositions: ["allOmnipoolPositions"],
  otcOrders: [QUERY_KEY_PREFIX, "otcOrders"],
  otcOrdersTable: [QUERY_KEY_PREFIX, "otcOrdersTable"],
  otcOrdersState: (orderId: Maybe<string | u32>) => [
    QUERY_KEY_PREFIX,
    "otcOrdersState",
    orderId?.toString(),
  ],
  provider: (url: string) => ["provider", url],
  math: ["@galacticcouncil/math"],
  existentialDeposit: [QUERY_KEY_PREFIX, "existentialDeposit"],
  metadataVersion: ["metadataVersion"],
  acceptedCurrencies: ["acceptedCurrencies"],
  accountCurrency: (address: Maybe<AccountId32 | string>) => [
    "accountCurrency",
    address,
  ],
  externalWalletKey: (walletAddress: string) => [
    "externalWallet",
    walletAddress,
  ],
  polkadotAccounts: ["polkadotAccounts"],
  maxAddLiquidityLimit: ["maxAddLiquidityLimit"],
  otcFee: ["otcFee"],
  insufficientFee: ["insufficientFee"],
  coingeckoUsd: ["coingeckoUsd"],
  polStats: ["polStats"],
  referendums: (accountAddress?: string, type?: "ongoing" | "finished") => [
    "referendums",
    accountAddress,
    type,
  ],
  referendumVotes: (accountAddress?: string) => [
    QUERY_KEY_PREFIX,
    "referendumVotes",
    accountAddress,
  ],
  referendumInfo: (id: string) => [QUERY_KEY_PREFIX, id, "referendumInfo"],
  stats: (
    type: ChartType,
    timeframe?: StatsTimeframe,
    assetSymbol?: string,
  ) => {
    const key = ["stats", type]

    if (timeframe) key.push(timeframe)
    if (assetSymbol) key.push(assetSymbol)

    return key
  },
  circulatingSupply: ["circulatingSupply"],
  stake: (address: string | undefined) => ["stake", address],
  staking: ["staking"],
  stakingPosition: (id: number | undefined) => ["totalStaking", id],
  stakingConsts: ["stakingConsts"],
  stakingEvents: ["stakingEvents"],
  stakingPositionBalances: (positionId: Maybe<string>) => [
    "positionBalances",
    positionId,
  ],
  stableswapPool: (id?: string) => ["stableswapPool", id],
  lbpPool: ["lbpPool"],
  bondEvents: (id?: Maybe<string>, myEvents?: boolean) => [
    "bondEvents",
    id,
    !!myEvents,
  ],
  bondEventsSquid: (id?: Maybe<string>, myEvents?: boolean) => [
    "bondEvents",
    id,
    !!myEvents,
  ],
  lbpPoolTotal: (id?: Maybe<string>) => ["lbpPoolTotal", id],
  lbpAveragePrice: (poolAddress?: string) => ["lbpAveragePrice", poolAddress],
  poolHistoricalBalance: (pool?: string, block?: number) => [
    "poolHistoricalBalance",
    pool,
    block,
  ],
  xykPools: ["xykPools"], //TODO: refresh each block??
  xykConsts: ["xykConsts"],
  shareTokens: (rpc: string) => ["shareTokens", rpc],
  totalXYKLiquidity: (address?: string) => [
    QUERY_KEY_PREFIX,
    "totalXYKLiquidity",
    address,
  ],
  volumeDaily: (assetId?: string) => ["volumeDaily", assetId],
  tvl: (assetId?: string) => ["tvl", assetId],
  identity: (address?: string) => ["identity", address],
  fee: (assetId?: string) => ["fee", assetId],
  evmTxCost: (data: string) => ["evmTxCost", data],
  evmChainInfo: (address: string) => ["evmChainInfo", address],
  evmAccountBinding: (address: string) => [address, "evmAccountBinding"],
  evmWalletReadiness: (address: string) => ["evmWalletReadiness", address],
  evmPaymentFee: (txHex: string, address?: string) => [
    "evmPaymentFee",
    txHex,
    address,
  ],
  referralCodes: (accountAddress?: string) => [
    "referralsCodes",
    accountAddress,
  ],
  referralCodeLength: ["referralCodeLength"],
  userReferrer: (accountAddress?: string) => ["userReferrer", accountAddress],
  referrerInfo: (referrerAddress?: string) => ["referrerInfo", referrerAddress],
  accountReferralShares: (accountAddress?: string) => [
    "accountReferralShares",
    accountAddress,
  ],
  referrerAddress: (referrerCode?: string) => ["referrerAddress", referrerCode],
  accountReferees: (referrerAddress?: string) => [
    "accountReferees",
    referrerAddress,
  ],
  referralLinkFee: ["referralLinkFee"],
  accountTransfers: (address: Maybe<AccountId32 | string>) => [
    "accountTransfers",
    address?.toString(),
  ],
  accountTransfersLive: (address: Maybe<AccountId32 | string>) => [
    QUERY_KEY_PREFIX,
    "accountTransfers",
    address?.toString(),
  ],
  yieldFarmCreated: ["yieldFarmCreated"],
  externalAssetRegistry: ["externalAssetRegistry"],
  assetHubAssetRegistry: ["assetHubAssetRegistry"],
  pendulumAssetRegistry: ["pendulumAssetRegistry"],
  assetHubNativeBalance: (address: Maybe<AccountId32 | string>) => [
    "assetHubNativeBalance",
    address?.toString(),
  ],
  polkadotRegistry: ["polkadotRegistry"],
  assetHubTokenBalance: (address: string, id: string) => [
    "assetHubTokenBalance",
    address,
    id,
  ],
  assetHubExistentialDeposit: (id: string) => [
    "assetHubExistentialDeposit",
    id,
  ],
  assetHubAssetAdminRights: (id: string) => ["assetHubAssetAdminRights", id],
  memepadDryRun: (address: string) => ["memepadDryRun", address],
  bridgeLink: (hash: string) => ["bridgeLink", hash],
  progressToast: (hash: string) => ["progressToast", hash],
  xcmTransfer: (
    asset: string,
    srcAddr: string,
    srcChain: string,
    dstAddr: string,
    dstChain: string,
  ) => ["xcmTransfer", asset, srcAddr, srcChain, dstAddr, dstChain],
  externalApi: (chain: string) => ["externalApi", chain],
} as const

export const WS_QUERY_KEYS = {
  omnipoolAssets: ["omnipoolAssets_"],
}
