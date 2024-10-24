import { Text } from "components/Typography/Text/Text"
import { SContainer, SJoinButton } from "./RedepositFarms.styled"
import { Trans, useTranslation } from "react-i18next"
import { JoinFarmModal } from "sections/pools/farms/modals/join/JoinFarmsModal"
import { useAccount } from "sections/web3-connect/Web3Connect.utils"
import { GlobalFarmRowMulti } from "sections/pools/farms/components/globalFarm/GlobalFarmRowMulti"
import { useState } from "react"
import { TFarmAprData } from "api/farms"
import {
  isXYKDeposit,
  TDepositData,
} from "sections/pools/farms/position/FarmingPosition.utils"
import { omit } from "utils/rx"
import { TDeposit } from "api/deposits"
import { usePoolData } from "sections/pools/pool/Pool"

type RedepositFarmsProps = {
  depositNft: TDeposit
  availableYieldFarms: TFarmAprData[]
  depositData: TDepositData
}

export const RedepositFarms = ({
  depositNft,
  availableYieldFarms,
  depositData,
}: RedepositFarmsProps) => {
  const { t } = useTranslation()
  const { account } = useAccount()
  const [joinFarm, setJoinFarm] = useState(false)
  const {
    pool: { totalFee },
  } = usePoolData()

  if (!availableYieldFarms.length) return null

  return (
    <SContainer>
      <div sx={{ flex: "column", gap: 4 }}>
        <Text fs={13} color="brightBlue300" tTransform="uppercase">
          <Trans t={t} i18nKey="farms.positions.redeposit.openFarms" />
        </Text>

        <GlobalFarmRowMulti
          farms={availableYieldFarms}
          fontSize={16}
          iconSize={24}
          totalFee={totalFee}
          css={{ flexDirection: "row-reverse" }}
        />
      </div>

      <SJoinButton
        onClick={() => setJoinFarm(true)}
        disabled={account?.isExternalWalletConnected}
      >
        <Text fs={12} color="basic900" tTransform="uppercase" tAlign="center">
          {t("farms.positions.join.button.label")}
        </Text>
      </SJoinButton>
      {joinFarm && (
        <JoinFarmModal
          position={
            !isXYKDeposit(depositData)
              ? omit(["depositId"], depositData)
              : undefined
          }
          onClose={() => setJoinFarm(false)}
          depositNft={depositNft}
        />
      )}
    </SContainer>
  )
}
