import { Web3ReactProvider } from "@web3-react/core"
import { providers } from "ethers"
import { Suspense, lazy } from "react"
import { GasStationProvider } from "sections/lending/components/transactions/GasStation/GasStationProvider"
import { BackgroundDataProvider } from "sections/lending/hooks/app-data-provider/BackgroundDataProvider"
import { AppDataProvider } from "sections/lending/hooks/app-data-provider/useAppDataProvider"
import { ModalContextProvider } from "sections/lending/hooks/useModal"
import { PermissionProvider } from "sections/lending/hooks/usePermissions"
import { Web3ContextProvider } from "sections/lending/libs/web3-data-provider/Web3Provider"
import { SharedDependenciesProvider } from "sections/lending/ui-config/SharedDependenciesProvider"
import { TransactionEventHandler } from "sections/lending/components/TransactionEventHandler"

const BorrowModal = lazy(async () => ({
  default: (
    await import("sections/lending/components/transactions/Borrow/BorrowModal")
  ).BorrowModal,
}))
const ClaimRewardsModal = lazy(async () => ({
  default: (
    await import(
      "sections/lending/components/transactions/ClaimRewards/ClaimRewardsModal"
    )
  ).ClaimRewardsModal,
}))
const CollateralChangeModal = lazy(async () => ({
  default: (
    await import(
      "sections/lending/components/transactions/CollateralChange/CollateralChangeModal"
    )
  ).CollateralChangeModal,
}))
const EmodeModal = lazy(async () => ({
  default: (
    await import("sections/lending/components/transactions/Emode/EmodeModal")
  ).EmodeModal,
}))
const RateSwitchModal = lazy(async () => ({
  default: (
    await import(
      "sections/lending/components/transactions/RateSwitch/RateSwitchModal"
    )
  ).RateSwitchModal,
}))
const RepayModal = lazy(async () => ({
  default: (
    await import("sections/lending/components/transactions/Repay/RepayModal")
  ).RepayModal,
}))
const SupplyModal = lazy(async () => ({
  default: (
    await import("sections/lending/components/transactions/Supply/SupplyModal")
  ).SupplyModal,
}))
const WithdrawModal = lazy(async () => ({
  default: (
    await import(
      "sections/lending/components/transactions/Withdraw/WithdrawModal"
    )
  ).WithdrawModal,
}))

function getWeb3Library(provider: any): providers.Web3Provider {
  const library = new providers.Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

export const LendingPageProviders = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <Web3ReactProvider getLibrary={getWeb3Library}>
      <BackgroundDataProvider>
        <Web3ContextProvider>
          <PermissionProvider>
            <ModalContextProvider>
              <AppDataProvider>
                <GasStationProvider>
                  <SharedDependenciesProvider>
                    {children}
                    <Suspense>
                      <SupplyModal />
                      <WithdrawModal />
                      <BorrowModal />
                      <RepayModal />
                      <CollateralChangeModal />
                      <RateSwitchModal />
                      <ClaimRewardsModal />
                      <EmodeModal />
                      <TransactionEventHandler />
                    </Suspense>
                  </SharedDependenciesProvider>
                </GasStationProvider>
              </AppDataProvider>
            </ModalContextProvider>
          </PermissionProvider>
        </Web3ContextProvider>
      </BackgroundDataProvider>
    </Web3ReactProvider>
  )
}
