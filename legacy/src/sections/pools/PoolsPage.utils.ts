import { useTokenBalance } from "api/balances"
import { useOmnipoolDataObserver } from "api/omnipool"
import { useMemo } from "react"
import { NATIVE_ASSET_ID } from "utils/api"
import { normalizeBigNumber } from "utils/balance"
import { BN_0, BN_1, BN_MILL, BN_NAN } from "utils/constants"
import {
  useDisplayAssetStore,
  useDisplayPrices,
  useDisplayShareTokenPrice,
} from "utils/displayAsset"
import { useStableswapPool } from "api/stableswap"
import { pool_account_name } from "@galacticcouncil/math-stableswap"
import { encodeAddress, blake2AsHex } from "@polkadot/util-crypto"
import { HYDRADX_SS58_PREFIX, XykMath } from "@galacticcouncil/sdk"
import { useAccountBalances } from "api/accountBalances"
import { isNotNil } from "utils/helpers"
import { useOmnipoolPositionsData } from "sections/wallet/assets/hydraPositions/data/WalletAssetsHydraPositionsData.utils"
import { useVolume } from "api/volume"
import BN from "bignumber.js"
import { useGetXYKPools, useXYKConsts } from "api/xyk"
import { useShareOfPools } from "api/pools"
import { useXYKPoolTradeVolumes } from "./pool/details/PoolDetails.utils"
import { useFee } from "api/stats"
import { useTVL } from "api/stats"
import { scaleHuman } from "utils/balance"
import { useAccountAssets } from "api/deposits"
import { TAsset, useAssets } from "providers/assets"
import { MetadataStore } from "@galacticcouncil/ui"
import { getTradabilityFromBits } from "api/omnipool"

export const isXYKPoolType = (pool: TPool | TXYKPool): pool is TXYKPool =>
  !!(pool as TXYKPool).shareTokenIssuance

export type TPool = NonNullable<ReturnType<typeof usePools>["data"]>[number]
export type TPoolDetails = NonNullable<
  ReturnType<typeof usePoolDetails>["data"]
>
export type TPoolFullData = TPool & TPoolDetails

export type TXYKPool = NonNullable<
  ReturnType<typeof useXYKPools>["data"]
>[number]

export const derivePoolAccount = (assetId: string) => {
  const name = pool_account_name(Number(assetId))
  return encodeAddress(blake2AsHex(name), HYDRADX_SS58_PREFIX)
}

const getTradeFee = (fee: string[]) => {
  if (fee?.length !== 2) return BN_NAN

  const numerator = new BN(fee[0])
  const denominator = new BN(fee[1])
  const tradeFee = numerator.div(denominator)

  return tradeFee.times(100)
}

export const usePools = () => {
  const { native, getAssetWithFallback } = useAssets()
  const { stableCoinId } = useDisplayAssetStore()

  const omnipoolAssets = useOmnipoolDataObserver()
  const accountAssets = useAccountAssets()

  const assetsId = useMemo(
    () => omnipoolAssets.data?.map((a) => a.id) ?? [],
    [omnipoolAssets.data],
  )

  const spotPrices = useDisplayPrices(
    stableCoinId ? [...assetsId, stableCoinId] : assetsId,
  )

  const volumes = useVolume("all")
  const fees = useFee("all")
  const tvls = useTVL("all")

  const isInitialLoading =
    spotPrices.isInitialLoading || omnipoolAssets.isLoading

  const data = useMemo(() => {
    if (!omnipoolAssets.data || !spotPrices.data) return undefined

    const rows = omnipoolAssets.data.map((asset) => {
      const meta = getAssetWithFallback(asset.id)
      const accountAsset = accountAssets.data?.accountAssetsMap.get(asset.id)

      const spotPrice = spotPrices.data?.find(
        (sp) => sp?.tokenIn === asset.id,
      )?.spotPrice

      const tradability = getTradabilityFromBits(asset.bits)

      const apiSpotPrice = spotPrices.data?.find(
        (sp) => sp?.tokenIn === stableCoinId,
      )?.spotPrice

      const tvlDisplay = BN(
        tvls.data?.find((tvl) => tvl.asset_id === Number(asset.id))?.tvl_usd ??
          BN_NAN,
      ).multipliedBy(apiSpotPrice ?? 1)

      const volume = BN(
        volumes.data?.find((volume) => volume.asset_id.toString() === asset.id)
          ?.volume_usd ?? BN_NAN,
      ).multipliedBy(apiSpotPrice ?? 1)

      const fee =
        native.id === asset.id
          ? BN_0
          : BN(
              fees.data?.find((fee) => fee.asset_id.toString() === asset.id)
                ?.projected_apr_perc ?? BN_NAN,
            )

      const filteredOmnipoolPositions = accountAsset?.liquidityPositions ?? []
      const filteredMiningPositions = accountAsset?.omnipoolDeposits ?? []
      const isPositions = !!accountAsset?.isPoolPositions

      return {
        id: asset.id,
        name: meta.name,
        symbol: meta.symbol,
        iconId: meta.iconId,
        meta,
        tvlDisplay,
        spotPrice,
        canAddLiquidity: tradability.canAddLiquidity,
        canRemoveLiquidity: tradability.canRemoveLiquidity,
        volume,
        isVolumeLoading: volumes?.isLoading,
        fee,
        isFeeLoading: fees?.isLoading,
        omnipoolPositions: filteredOmnipoolPositions,
        miningPositions: filteredMiningPositions,
        balance: accountAsset?.balance,
        isPositions,
      }
    })

    return rows.sort((poolA, poolB) => {
      if (poolA.id === NATIVE_ASSET_ID) {
        return -1
      }

      if (poolB.id === NATIVE_ASSET_ID) {
        return 1
      }

      return poolA.tvlDisplay.gt(poolB.tvlDisplay) ? -1 : 1
    })
  }, [
    omnipoolAssets.data,
    spotPrices.data,
    tvls.data,
    volumes.data,
    volumes?.isLoading,
    native.id,
    fees.data,
    fees?.isLoading,
    accountAssets.data,
    stableCoinId,
    getAssetWithFallback,
  ])

  return { data, isLoading: isInitialLoading }
}

export const usePoolDetails = (assetId: string) => {
  const { getAsset } = useAssets()
  const meta = getAsset(assetId)
  const isStablePool = meta?.isStableSwap

  const omnipoolPositions = useOmnipoolPositionsData()

  const stablePoolBalance = useAccountBalances(
    isStablePool ? derivePoolAccount(assetId) : undefined,
  )
  const stablepool = useStableswapPool(isStablePool ? assetId : undefined)

  const isInitialLoading = stablePoolBalance.isInitialLoading

  const data = useMemo(() => {
    const omnipoolNftPositions = omnipoolPositions.data.filter(
      (position) => position.assetId === assetId,
    )

    const reserves = isStablePool
      ? (stablePoolBalance.data?.balances ?? []).map((balance) => {
          const id = balance.assetId.toString()
          const meta = getAsset(id) as TAsset

          return {
            asset_id: Number(id),
            decimals: meta.decimals,
            amount: balance.freeBalance.toString(),
          }
        })
      : []

    return {
      omnipoolNftPositions,
      reserves,
      stablepoolFee: stablepool.data?.fee
        ? normalizeBigNumber(stablepool.data.fee).div(BN_MILL)
        : undefined,
      isStablePool,
      stablePoolBalance: stablePoolBalance.data?.balances,
    }
  }, [
    getAsset,
    assetId,
    isStablePool,
    omnipoolPositions.data,
    stablePoolBalance.data?.balances,
    stablepool.data?.fee,
  ])

  return { data, isInitialLoading }
}

export const useXYKPools = () => {
  const pools = useGetXYKPools()
  const xykConsts = useXYKConsts()
  const { getShareTokenByAddress, shareTokens } = useAssets()

  const shareTokensId = shareTokens.map((shareToken) => shareToken.id) ?? []

  const totalIssuances = useShareOfPools(shareTokensId)
  const shareTokeSpotPrices = useDisplayShareTokenPrice(shareTokensId)

  const fee = xykConsts.data?.fee ? getTradeFee(xykConsts.data?.fee) : BN_NAN

  const volumes = useXYKPoolTradeVolumes(
    shareTokens.length
      ? shareTokens.map((shareToken) => shareToken.poolAddress)
      : [],
  )

  const accountAssets = useAccountAssets()
  const queries = [pools, xykConsts, shareTokeSpotPrices, totalIssuances]

  const isInitialLoading = queries.some((q) => q.isInitialLoading)

  const whitelist = useMemo(
    () => MetadataStore.getInstance().externalWhitelist(),
    [],
  )

  const data = useMemo(() => {
    if (
      !pools.data ||
      !shareTokens.length ||
      !shareTokeSpotPrices.data ||
      !totalIssuances.data
    )
      return undefined

    return pools.data
      .map((pool) => {
        const shareToken = getShareTokenByAddress(pool.poolAddress)

        if (!shareToken) return undefined

        const accountAsset = accountAssets.data?.accountAssetsMap.get(
          shareToken.id,
        )

        const shareTokenId = shareToken.id

        const shareTokenIssuance = totalIssuances.data?.find(
          (issuance) => issuance.asset === shareTokenId,
        )

        const shareTokenSpotPrice = shareTokeSpotPrices.data.find(
          (shareTokeSpotPrice) => shareTokeSpotPrice.tokenIn === shareTokenId,
        )

        let isInvalid = !shareToken.assets.some(
          (asset) => asset.isSufficient || whitelist.includes(asset.id),
        )

        const tvlDisplay =
          shareTokenIssuance?.totalShare
            ?.shiftedBy(-shareToken.decimals)
            ?.multipliedBy(shareTokenSpotPrice?.spotPrice ?? 1) ?? BN_0

        const volume =
          volumes.data?.find(
            (volume) => volume.poolAddress === pool.poolAddress,
          )?.volume ?? BN_NAN

        const miningPositions = accountAsset?.xykDeposits ?? []
        const balance = accountAsset?.balance
        const isPositions = !!accountAsset?.isPoolPositions

        return {
          id: shareToken.id,
          symbol: shareToken.symbol,
          name: shareToken.name,
          iconId: shareToken.iconId,
          meta: shareToken,
          tvlDisplay,
          spotPrice: shareTokenSpotPrice?.spotPrice,
          fee,
          isXykPool: true,
          poolAddress: pool.poolAddress,
          canAddLiquidity: true,
          canRemoveLiquidity: true,
          shareTokenIssuance,
          volume,
          isVolumeLoading: volumes.isLoading,
          miningPositions,
          isInvalid,
          balance,
          isPositions,
        }
      })
      .filter(isNotNil)
      .sort((a, b) => {
        if (a.isInvalid) return 1
        if (b.isInvalid) return -1

        return b.tvlDisplay.minus(a.tvlDisplay).toNumber()
      })
  }, [
    pools.data,
    shareTokens.length,
    shareTokeSpotPrices.data,
    totalIssuances.data,
    getShareTokenByAddress,
    accountAssets.data?.accountAssetsMap,
    volumes.data,
    volumes.isLoading,
    fee,
    whitelist,
  ])

  return { data, isInitialLoading }
}

export const useXYKSpotPrice = (shareTokenId: string) => {
  const { getShareToken } = useAssets()
  const shareToken = getShareToken(shareTokenId)

  const poolAddress = shareToken?.poolAddress
  const [metaA, metaB] = shareToken?.assets ?? []

  const assetABalance = useTokenBalance(metaA.id, poolAddress)
  const assetBBalance = useTokenBalance(metaB.id, poolAddress)

  if (!shareToken || !assetABalance.data || !assetBBalance.data)
    return undefined

  const priceA = scaleHuman(
    XykMath.getSpotPrice(
      assetABalance.data.balance.toString(),
      assetBBalance.data.balance.toString(),
      BN_1.shiftedBy(metaA.decimals).toString(),
    ),
    metaB.decimals,
  )

  const priceB = scaleHuman(
    XykMath.getSpotPrice(
      assetBBalance.data.balance.toString(),
      assetABalance.data.balance.toString(),
      BN_1.shiftedBy(metaB.decimals).toString(),
    ),
    metaA.decimals,
  )

  return { priceA, priceB, assetA: metaA, assetB: metaB }
}
