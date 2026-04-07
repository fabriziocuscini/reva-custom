'use client'

import { DecorativeBox, Stack } from '@reva/ui'

export const code = `<Stack gap="4">
  <DecorativeBox h="12" />
  <DecorativeBox h="12" />
  <DecorativeBox h="12" />
</Stack>`

export default function StackDefault() {
  return (
    <Stack gap="4">
      <DecorativeBox h="12" />
      <DecorativeBox h="12" />
      <DecorativeBox h="12" />
    </Stack>
  )
}
