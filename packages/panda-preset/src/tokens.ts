import { defineTokens } from '@pandacss/dev'
import pandaTokens from '@reva/tokens/panda/tokens'

export const tokens = defineTokens({
  ...pandaTokens,
  sizes: pandaTokens.spacing,
})

/** Flatten `{ value: string }` token format to Panda's flat breakpoint map. */
export const breakpoints: Record<string, string> = Object.fromEntries(
  Object.entries(pandaTokens.breakpoints).map(([key, token]) => [
    key,
    (token as { value: string }).value,
  ]),
)
