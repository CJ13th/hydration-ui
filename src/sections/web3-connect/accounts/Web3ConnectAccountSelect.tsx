import { css } from "@emotion/react"
import CopyIcon from "assets/icons/CopyIcon.svg?react"
import { AccountAvatar } from "components/AccountAvatar/AccountAvatar"
import { InfoTooltip } from "components/InfoTooltip/InfoTooltip"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { useCopyToClipboard, useMedia } from "react-use"
import { shortenAccountAddress } from "utils/formatting"
import { theme as themeParams } from "theme"
import { WalletProviderType } from "sections/web3-connect/constants/providers"
import BigNumber from "bignumber.js"
import { DisplayValue } from "components/DisplayValue/DisplayValue"
import { BN_BILL } from "utils/constants"
import { getWalletProviderByType } from "sections/web3-connect/Web3Connect.utils"
import { isEvmAddress } from "utils/evm"
import { Badge } from "components/Badge/Badge"

type Props = {
  name: string
  genesisHash?: `0x${string}`
  address: string
  balance?: BigNumber
  onClick?: () => void
  provider?: WalletProviderType | null
  isProxy?: boolean
  isActive?: boolean
}

export const Web3ConnectAccountSelect = ({
  name,
  genesisHash,
  address,
  balance,
  onClick,
  isActive,
  provider,
}: Props) => {
  const { t } = useTranslation()
  const [, copy] = useCopyToClipboard()
  const isDesktop = useMedia(themeParams.viewport.gte.sm)
  const { wallet } = getWalletProviderByType(provider)
  const isEvm = isEvmAddress(address)

  return (
    <div onClick={onClick} sx={{ flex: "row", align: "center", gap: 12 }}>
      <AccountAvatar
        address={address}
        genesisHash={genesisHash}
        provider={provider}
        size={32}
      />

      <div sx={{ flex: "column", gap: 6 }} css={{ flex: 1 }}>
        <div sx={{ flex: "row", justify: "space-between" }}>
          <div sx={{ flex: "row", align: "center", gap: 4 }}>
            {wallet && (
              <img
                loading="lazy"
                src={wallet.logo.src}
                alt={wallet.logo.alt}
                width={12}
                height={12}
              />
            )}
            <Text fs={14} color="white">
              {name}
            </Text>
            {isEvm && (
              <Badge size="small" variant="orange" rounded={false}>
                EVM
              </Badge>
            )}
          </div>
          <Text fs={14} color="graySoft">
            {balance?.isFinite() && (
              <DisplayValue value={balance} compact={balance.gt(BN_BILL)} />
            )}
          </Text>
        </div>
        <div sx={{ flex: "row", justify: "space-between" }}>
          <Text
            fs={13}
            color={isActive ? "brightBlue200" : "darkBlue200"}
            css={css`
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            `}
          >
            {isDesktop ? address : shortenAccountAddress(address, 12)}
          </Text>
          <InfoTooltip
            text={t("wallet.header.copyAddress.hover")}
            textOnClick={t("wallet.header.copyAddress.click")}
          >
            <CopyIcon
              width={18}
              height={18}
              sx={{ color: isActive ? "brightBlue200" : "darkBlue200", mt: -4 }}
              css={{
                cursor: "pointer",
              }}
              onClick={() => copy(address.toString())}
            />
          </InfoTooltip>
        </div>
      </div>
    </div>
  )
}
