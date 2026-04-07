'use client'

import { DecorativeBox, Flex } from '@reva/ui'

export const code = `<Flex gap="4" align="center" justify="space-between" h="16" bg="neutral.bg.muted" p="4" rounded="md">
  <DecorativeBox h="8" w="16" />
  <DecorativeBox h="12" w="16" />
  <DecorativeBox h="10" w="16" />
</Flex>`

export default function FlexAlignJustify() {
  return (
    <Flex gap="4" align="center" justify="space-between" h="16" bg="neutral.bg.muted" p="4" rounded="md">
      <DecorativeBox h="8" w="16" />
      <DecorativeBox h="12" w="16" />
      <DecorativeBox h="10" w="16" />
    </Flex>
  )
}
