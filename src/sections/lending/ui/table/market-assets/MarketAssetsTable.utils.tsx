import { useNavigate } from "@tanstack/react-location"
import { createColumnHelper } from "@tanstack/react-table"
import { Button } from "components/Button/Button"
import { DisplayValue } from "components/DisplayValue/DisplayValue"
import { Text } from "components/Typography/Text/Text"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ROUTES } from "sections/lending/components/primitives/Link"
import { NoData } from "sections/lending/components/primitives/NoData"
import { useAppDataContext } from "sections/lending/hooks/app-data-provider/useAppDataProvider"
import { useProtocolDataContext } from "sections/lending/hooks/useProtocolDataContext"
import { AssetNameColumn } from "sections/lending/ui/columns/AssetNameColumn"
import { IncentivesCard } from "sections/lending/ui/incentives/IncentivesCard"

export type TSupplyAssetsTableData = ReturnType<typeof useAppDataContext>
export type TSupplyAssetsRow = TSupplyAssetsTableData["reserves"][number]

const { accessor, display } = createColumnHelper<TSupplyAssetsRow>()

export const useMarketAssetsTableColumns = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { currentMarket } = useProtocolDataContext()

  return useMemo(
    () => [
      accessor("symbol", {
        header: "Asset",
        cell: ({ row }) => (
          <AssetNameColumn
            detailsAddress={row.original.underlyingAsset}
            symbol={row.original.symbol}
            iconSymbol={row.original.iconSymbol}
          />
        ),
      }),
      accessor("totalLiquidityUSD", {
        header: "Total supplied",
        meta: {
          sx: {
            textAlign: ["end", "start"],
          },
        },
        sortingFn: (a, b) =>
          Number(a.original.totalLiquidityUSD) -
          Number(b.original.totalLiquidityUSD),
        cell: ({ row }) => {
          const { totalLiquidityUSD, totalLiquidity } = row.original
          const value = Number(totalLiquidity)
          const valueUsd = Number(totalLiquidityUSD)
          return (
            <span>
              {t("value.compact", { value })}
              {value > 0 && (
                <span
                  css={{ display: "block" }}
                  sx={{ color: "basic300", fontSize: 12, lineHeight: 16 }}
                >
                  <DisplayValue compact value={valueUsd} isUSD />
                </span>
              )}
            </span>
          )
        },
      }),
      accessor("supplyAPY", {
        header: "APY",
        meta: {
          sx: {
            textAlign: "center",
          },
        },
        cell: ({ row }) => {
          const { supplyAPY, aIncentivesData, symbol } = row.original

          return (
            <IncentivesCard
              value={supplyAPY}
              incentives={aIncentivesData}
              symbol={symbol}
            />
          )
        },
      }),
      accessor("totalDebtUSD", {
        header: "Total borrowed",
        meta: {
          sx: {
            textAlign: "center",
          },
        },
        sortingFn: (a, b) =>
          Number(a.original.totalDebtUSD) - Number(b.original.totalDebtUSD),
        cell: ({ row }) => {
          const { totalDebtUSD, totalDebt, borrowingEnabled } = row.original

          const value = Number(totalDebt)
          const valueUsd = Number(totalDebtUSD)

          return (
            <>
              {borrowingEnabled || value > 0 ? (
                <span>
                  {t("value.compact", { value })}
                  {value > 0 && (
                    <span
                      css={{ display: "block" }}
                      sx={{ color: "basic300", fontSize: 12, lineHeight: 16 }}
                    >
                      <DisplayValue compact value={valueUsd} isUSD />
                    </span>
                  )}
                </span>
              ) : (
                <NoData />
              )}
            </>
          )
        },
      }),
      accessor("variableBorrowAPY", {
        header: "Borrow APY, variable",
        meta: {
          sx: {
            textAlign: "center",
          },
        },
        cell: ({ row }) => {
          const {
            symbol,
            totalVariableDebt,
            totalVariableDebtUSD,
            variableBorrowAPY,
            vIncentivesData,
            borrowingEnabled,
            isFrozen,
          } = row.original

          return (
            <>
              <IncentivesCard
                value={
                  Number(totalVariableDebtUSD) > 0 ? variableBorrowAPY : "-1"
                }
                incentives={vIncentivesData || []}
                symbol={symbol}
              />
              {!borrowingEnabled &&
                Number(totalVariableDebt) > 0 &&
                !isFrozen && (
                  <Text as="span" fs={12} color="basic500">
                    (Disabled)
                  </Text>
                )}
            </>
          )
        },
      }),
      display({
        id: "actions",
        meta: {
          sx: {
            textAlign: "end",
          },
        },
        cell: ({ row }) => {
          const { underlyingAsset } = row.original
          return (
            <Button
              size="micro"
              css={{ minHeight: 27 }}
              onClick={() =>
                navigate({
                  to: ROUTES.reserveOverview(underlyingAsset, currentMarket),
                })
              }
            >
              Details
            </Button>
          )
        },
      }),
    ],
    [currentMarket, navigate, t],
  )
}
