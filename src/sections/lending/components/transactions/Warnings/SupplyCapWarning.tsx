import { AssetCapData } from "sections/lending/hooks/useAssetCaps"
import { Link } from "sections/lending/components/primitives/Link"
import { Alert } from "components/Alert"

type SupplyCapWarningProps = {
  supplyCap: AssetCapData
  icon?: boolean
}

export const SupplyCapWarning = ({
  supplyCap,
  icon = true,
  ...rest
}: SupplyCapWarningProps) => {
  // Don't show a warning when less than 98% utilized
  if (!supplyCap.percentUsed || supplyCap.percentUsed < 98) return null

  const severity = "warning"

  const renderText = () => {
    return supplyCap.isMaxed ? (
      <span>
        Protocol supply cap is at 100% for this asset. Further supply
        unavailable.
      </span>
    ) : (
      <span>
        Maximum amount available to supply is limited because protocol supply
        cap is at {supplyCap.percentUsed.toFixed(2)}%.
      </span>
    )
  }

  return (
    <Alert variant={severity} {...rest}>
      {renderText()}{" "}
      <Link
        href="https://docs.aave.com/developers/whats-new/supply-borrow-caps"
        css={{ textDecoration: "underline" }}
      >
        <span>Learn more</span>
      </Link>
    </Alert>
  )
}
