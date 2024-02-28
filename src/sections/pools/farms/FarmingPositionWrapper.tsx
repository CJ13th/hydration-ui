import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { FarmingPosition } from "./position/FarmingPosition"
import { Icon } from "components/Icon/Icon"
import FPIcon from "assets/icons/PoolsAndFarms.svg?react"
import { ClaimRewardsCard } from "./components/claimableCard/ClaimRewardsCard"
import { Spacer } from "components/Spacer/Spacer"
import { TPool, TPoolDetails } from "sections/pools/PoolsPage.utils"
import { Button } from "components/Button/Button"
import ExitIcon from "assets/icons/Exit.svg?react"
import { useFarmExitAllMutation } from "utils/farms/exit"

interface Props {
  pool: TPool
  positions: TPoolDetails["miningNftPositions"]
}

export const FarmingPositionWrapper = ({ pool, positions }: Props) => {
  const { t } = useTranslation()

  const exit = useFarmExitAllMutation(
    positions,
    {},
    // toast,
  )

  if (!positions.length) return null

  return (
    <div>
      <div sx={{ flex: "row", mb: 20, justify: "space-between" }}>
        <div sx={{ flex: "row", align: "center", gap: 8 }}>
          <Icon size={13} sx={{ color: "brightBlue300" }} icon={<FPIcon />} />
          <Text fs={[16, 16]} color="brightBlue300">
            {t("farms.positions.header.title")}
          </Text>
        </div>
        <Button variant="error" size="compact" onClick={() => exit.mutate()}>
          <Icon size={12} icon={<ExitIcon />} />
          Exit All Farms
        </Button>
      </div>

      <ClaimRewardsCard poolId={pool.id} />
      <Spacer size={12} />

      <div sx={{ flex: "column", gap: 16 }}>
        {positions.map((item, i) => (
          <FarmingPosition
            key={i}
            poolId={pool.id}
            index={i + 1}
            depositNft={item}
          />
        ))}
      </div>
    </div>
  )
}
