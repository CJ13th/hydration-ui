import { Typography } from "@mui/material"
import { Warning } from "sections/lending/components/primitives/Warning"
import { convertParaswapErrorMessage } from "sections/lending/hooks/paraswap/common"

interface ParaswapRatesErrorProps {
  error: unknown
}

export const ParaswapRatesError = ({ error }: ParaswapRatesErrorProps) => {
  return (
    <Warning variant="error" sx={{ mt: 4 }}>
      <Typography variant="caption">
        {error instanceof Error
          ? convertParaswapErrorMessage(error.message)
          : "There was an issue fetching data from Paraswap"}
      </Typography>
    </Warning>
  )
}
