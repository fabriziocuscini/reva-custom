'use client'

import { DecorativeBox, Stack } from '@reva/ui'

export const code = `<Stack gap="4" separator>
  <DecorativeBox h="12" />
  <DecorativeBox h="12" />
  <DecorativeBox h="12" />
</Stack>`

export default function StackWithSeparator() {
  return (
    <Stack gap="4" separator>
      <DecorativeBox h="12" />
      <DecorativeBox h="12" />
      <DecorativeBox h="12" />
    </Stack>
  )
}
