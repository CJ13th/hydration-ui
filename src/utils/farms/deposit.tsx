import { TFarmAprData } from "api/farms"
import { Trans } from "react-i18next"
import { ToastMessage, TransactionOptions, useStore } from "state/store"
import { useRpcProvider } from "providers/rpcProvider"
import { TOAST_MESSAGES } from "state/toasts"
import { useAccount } from "sections/web3-connect/Web3Connect.utils"
import { isEvmAccount } from "utils/evm"
import { ApiPromise } from "@polkadot/api"
import { t } from "i18next"
import BN from "bignumber.js"
import { SubmittableExtrinsic } from "@polkadot/api/promise/types"
import { scaleHuman } from "utils/balance"
import { TShareToken, useAssets } from "providers/assets"
import { useRefetchAccountAssets } from "api/deposits"

type XYKInput = { shares: string; depositId?: string }
type OmnipoolInput = { positionId: string; value: string; depositId?: string }

export type TJoinFarmsInput = XYKInput | OmnipoolInput

const isXYKData = (data: TJoinFarmsInput): data is XYKInput => {
  return (data as XYKInput).shares !== undefined
}

export const xykDepositTx = (
  api: ApiPromise,
  farm: TFarmAprData,
  shares: string,
  { assetIn, assetOut }: { assetIn: string; assetOut: string },
) =>
  api.tx.xykLiquidityMining.depositShares(
    farm.globalFarmId,
    farm.yieldFarmId,
    {
      assetIn,
      assetOut,
    },
    shares,
  )

export const depositTx = (
  api: ApiPromise,
  farm: TFarmAprData,
  positionId: string,
) =>
  api.tx.omnipoolLiquidityMining.depositShares(
    farm.globalFarmId,
    farm.yieldFarmId,
    positionId,
  )

export const xykRedepositTx = (
  api: ApiPromise,
  farm: TFarmAprData,
  depositId: string,
  { assetIn, assetOut }: { assetIn: string; assetOut: string },
) =>
  api.tx.xykLiquidityMining.redepositShares(
    farm.globalFarmId,
    farm.yieldFarmId,
    {
      assetIn,
      assetOut,
    },
    depositId,
  )

export const redepositTx = (
  api: ApiPromise,
  farm: TFarmAprData,
  depositId: string,
) =>
  api.tx.omnipoolLiquidityMining.redepositShares(
    farm.globalFarmId,
    farm.yieldFarmId,
    depositId,
  )

export const getToasts = (value: BN, symbol: string) =>
  TOAST_MESSAGES.reduce((memo, type) => {
    const msType = type === "onError" ? "onLoading" : type
    memo[type] = (
      <Trans
        t={t}
        i18nKey={`farms.modal.join.toast.${msType}`}
        tOptions={{
          amount: value,
          symbol: symbol,
        }}
      >
        <span />
        <span className="highlight" />
      </Trans>
    )
    return memo
  }, {} as ToastMessage)

type TArgs = {
  poolId: string
  farms: TFarmAprData[]
  deposit?: TransactionOptions
  redeposit?: TransactionOptions
}

export const useJoinFarms = ({ farms, deposit, redeposit, poolId }: TArgs) => {
  const { api } = useRpcProvider()
  const { account } = useAccount()
  const isEvm = isEvmAccount(account?.address)
  const refetchAccountAssets = useRefetchAccountAssets()
  const { getAsset } = useAssets()

  const { createTransaction } = useStore()

  const meta = getAsset(poolId)

  const getDepositId = async (nftId: string) => {
    const positions = await api.query.uniques.account.entries(
      account?.address,
      nftId,
    )

    return positions
      .map((position) => position[0].args[2].toNumber())
      .sort((a, b) => b - a)[0]
      .toString()
  }

  return async (data: TJoinFarmsInput) => {
    if (!farms.length) throw new Error("There are no farms to join")
    if (!meta) throw new Error("Missing asset meta")

    const isXyk = isXYKData(data)
    const [firstFarm, ...restFarms] = farms

    const isRestFarms = restFarms?.length
    const depositId = data.depositId

    const toast = getToasts(
      scaleHuman(isXyk ? data.shares : data.value, meta.decimals),
      meta.symbol,
    )

    const executeRedeposit = async (
      depositId: string,
      farms: TFarmAprData[],
    ) => {
      let txs: SubmittableExtrinsic[]

      if (isXyk) {
        const { assets } = meta as TShareToken
        txs = farms.map((farm) =>
          xykRedepositTx(api, farm, depositId, {
            assetIn: assets[0].id,
            assetOut: assets[1].id,
          }),
        )
      } else {
        txs = farms.map((farm) => redepositTx(api, farm, depositId))
      }

      await createTransaction(
        {
          tx: txs.length > 1 ? api.tx.utility.batch(txs) : txs[0],
          title: t("farms.modal.join.rest.title"),
        },
        {
          toast,
          ...redeposit,
          onSuccess: (result) => {
            refetchAccountAssets()

            redeposit?.onSuccess?.(result)
          },
        },
      )
    }

    if (!depositId) {
      let tx: SubmittableExtrinsic

      if (isXyk) {
        const { assets } = meta as TShareToken

        tx = xykDepositTx(api, firstFarm, data.shares, {
          assetIn: assets[0].id,
          assetOut: assets[1].id,
        })
      } else {
        tx = depositTx(api, firstFarm, data.positionId)
      }
      const rewardCurrencySymbol = getAsset(firstFarm.rewardCurrency)?.symbol

      await createTransaction(
        {
          tx,
          title: t("farms.modal.join.first.title", {
            symbol: rewardCurrencySymbol,
          }),
        },
        {
          toast,
          ...deposit,
          onSuccess: async (result) => {
            refetchAccountAssets()
            deposit?.onSuccess?.(result)

            if (isRestFarms) {
              let depositId: string | undefined = undefined

              const pallet = isXyk
                ? "xykLiquidityMining"
                : "omnipoolLiquidityMining"

              if (isEvm) {
                const nftId =
                  await api.consts[pallet].nftCollectionId.toString()
                depositId = await getDepositId(nftId)
              } else {
                for (const record of result.events) {
                  if (api.events[pallet].SharesDeposited.is(record.event)) {
                    depositId = record.event.data.depositId.toString()
                  }
                }
              }

              if (depositId) {
                await executeRedeposit(depositId, restFarms)
              }
            }
          },
        },
      )
    } else {
      await executeRedeposit(depositId, farms)
    }
  }
}
