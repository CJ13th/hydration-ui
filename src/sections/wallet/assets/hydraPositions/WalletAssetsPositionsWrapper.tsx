import { WalletAssetsHydraPositions } from "./WalletAssetsHydraPositions"
import {
  useOmnipoolPositionsData,
  useXykPositionsData,
} from "./data/WalletAssetsHydraPositionsData.utils"
import { WalletAssetsHydraPositionsSkeleton } from "./skeleton/WalletAssetsHydraPositionsSkeleton"
import { useWalletAssetsFilters } from "sections/wallet/assets/WalletAssets.utils"

export const WalletAssetsPositionsWrapper = () => {
  const { search } = useWalletAssetsFilters()

  const positionsTable = useOmnipoolPositionsData({ search })
  const xykPositions = useXykPositionsData({ search })

  const allPositions = [...positionsTable.data, ...xykPositions.data].sort(
    (a, b) => b.valueDisplay.minus(a.valueDisplay).toNumber(),
  )

  if (positionsTable.isLoading || xykPositions.isLoading)
    return <WalletAssetsHydraPositionsSkeleton />

  return <WalletAssetsHydraPositions data={allPositions} />
}
