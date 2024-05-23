import { FC, PropsWithChildren } from "react"
import { useLocation } from "react-use"
import { MigrationExportModal } from "./components/MigrationExportModal"
import { MigrationImportModal } from "./components/MigrationImportModal"

import {
  MIGRATION_TRIGGER_URL,
  MIGRATION_TARGET_URL,
  MIGRATION_QUERY_PARAM,
  MIGRATION_LS_KEYS,
  serializeLocalStorage,
} from "sections/migration/MigrationProvider.utils"

export const MigrationProvider: FC<PropsWithChildren> = ({ children }) => {
  const { origin, search } = useLocation()

  const urlParams = new URLSearchParams(search)

  const shouldExport = MIGRATION_TRIGGER_URL === origin
  const shouldImport =
    MIGRATION_TARGET_URL === origin && urlParams.has(MIGRATION_QUERY_PARAM)

  if (shouldImport) {
    return (
      <MigrationImportModal data={urlParams.get(MIGRATION_QUERY_PARAM) ?? ""} />
    )
  }

  if (shouldExport) {
    return (
      <MigrationExportModal data={serializeLocalStorage(MIGRATION_LS_KEYS)} />
    )
  }

  return <>{children}</>
}
