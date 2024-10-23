import * as React from "react"
import { createComponent } from "@lit-labs/react"
import {
  AssetId,
  AssetBadge,
  ChainLogo as ChainLogoUi,
  PlaceholderLogo,
} from "@galacticcouncil/ui"
import { assetPlaceholderCss, SATokenWrapper } from "./AssetIcon.styled"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useExternalAssetsWhiteList } from "api/external"
import { HYDRADX_PARACHAIN_ID } from "@galacticcouncil/sdk"
import { ResponsiveValue } from "utils/responsive"
import { useAssets } from "providers/assets"
import { Icon } from "components/Icon/Icon"
import { MultipleIcons } from "components/MultipleIcons/MultipleIcons"

export const UigcAssetPlaceholder = createComponent({
  tagName: "uigc-logo-placeholder",
  elementClass: PlaceholderLogo,
  react: React,
})

export const UigcAssetId = createComponent({
  tagName: "uigc-asset-id",
  elementClass: AssetId,
  react: React,
})

export const UigcAssetBadge = createComponent({
  tagName: "uigc-asset-badge",
  elementClass: AssetBadge,
  react: React,
})

export const UigcChainLogo = createComponent({
  tagName: "uigc-logo-chain",
  elementClass: ChainLogoUi,
  react: React,
})

export const MultipleAssetLogo = ({
  iconId,
  size = 26,
}: {
  iconId: string | string[] | undefined
  size?: ResponsiveValue<number>
}) => {
  const { getAssetWithFallback } = useAssets()
  if (!iconId) return <Icon size={size} icon={<AssetLogo id={iconId} />} />
  const allIconIds = Array.isArray(iconId)
    ? iconId
        .map((id) => {
          const { iconId } = getAssetWithFallback(id)

          return iconId
        })
        .flat()
    : iconId
  return typeof allIconIds === "string" ? (
    <Icon size={size} icon={<AssetLogo id={allIconIds} />} />
  ) : (
    <MultipleIcons
      size={size}
      icons={allIconIds.map((id) => ({
        icon: <AssetLogo key={id} id={id} />,
      }))}
    />
  )
}

const A_TOKENS_MAP: { [key: string]: string } = {
  // aDOT
  "1000037": "5",
  // aUSDT
  "1000039": "10",
  // aUSDC
  "1000038": "21",
  // aWETH
  "1000041": "20",
  // aWBTC
  "1000040": "3",
}

export const AssetLogo = ({ id }: { id?: string }) => {
  const { t } = useTranslation()
  const { getAsset } = useAssets()

  const { getIsWhiteListed } = useExternalAssetsWhiteList()

  const asset = useMemo(() => {
    const aTokenId = id ? A_TOKENS_MAP[id] : undefined
    const assetId = aTokenId ?? id
    const assetDetails = assetId ? getAsset(assetId) : undefined
    const { badge } = getIsWhiteListed(assetDetails?.id ?? "")

    if (aTokenId) {
      delete assetDetails?.parachainId
    }

    return {
      details: assetDetails,
      badgeVariant: badge,
      aTokenId: id ? A_TOKENS_MAP[id] : undefined,
    }
  }, [getAsset, getIsWhiteListed, id])

  const { details, badgeVariant, aTokenId } = asset

  if (details) {
    const Wrapper = aTokenId ? SATokenWrapper : React.Fragment
    return (
      <Wrapper>
        <UigcAssetId
          css={{ "& uigc-logo-chain": { display: "none" } }}
          ref={(el) => {
            el &&
              details.parachainId &&
              el.setAttribute("chainOrigin", details.parachainId)
            el && el.setAttribute("fit", "")
          }}
          ecosystem="polkadot"
          asset={details.id}
          chain={HYDRADX_PARACHAIN_ID.toString()}
          chainOrigin={details.parachainId}
        >
          {badgeVariant && (
            <UigcAssetBadge
              slot="badge"
              variant={badgeVariant}
              text={t(`wallet.addToken.tooltip.${badgeVariant}`)}
            />
          )}
        </UigcAssetId>
      </Wrapper>
    )
  }

  return (
    <UigcAssetPlaceholder
      css={assetPlaceholderCss}
      ref={(el) => el && el.setAttribute("fit", "")}
      slot="placeholder"
    />
  )
}

export const ExternalAssetLogo = ({
  id,
  parachainId,
  originHidden,
  children,
}: {
  id: string
  parachainId: number
  originHidden?: boolean
  children?: React.ReactNode
}) => {
  return (
    <UigcAssetId
      css={{ "& uigc-logo-chain": { display: "none" } }}
      ref={(el) => {
        if (el) {
          el.setAttribute("fit", "")
          if (parachainId && !originHidden)
            el.setAttribute("chainOrigin", parachainId.toString())
          el.shadowRoot
            ?.querySelector("uigc-logo-asset")
            ?.setAttribute("style", "width:100%;height:100%;")
        }
      }}
      ecosystem="polkadot"
      asset={id}
      chain={parachainId.toString()}
      chainOrigin={!originHidden ? parachainId.toString() : undefined}
    >
      {children}
    </UigcAssetId>
  )
}

export const ChainLogo = ({ id }: { id?: number }) => {
  return (
    <UigcChainLogo
      ecosystem={"polkadot"}
      chain={id?.toString()}
      ref={(el) => el && el.setAttribute("fit", "")}
    >
      <UigcAssetPlaceholder
        css={assetPlaceholderCss}
        ref={(el) => el && el.setAttribute("fit", "")}
        slot="placeholder"
      />
    </UigcChainLogo>
  )
}
