'use client'

import { DecorativeBox, Flex } from '@reva/ui'

export const code = `<Flex gap="4">
  <DecorativeBox h="16" w="24" />
  <DecorativeBox h="16" w="24" />
  <DecorativeBox h="16" w="24" />
</Flex>`

export default function FlexDefault() {
  return (
    <Flex gap="4">
      <DecorativeBox h="16" w="24" />
      <DecorativeBox h="16" w="24" />
      <DecorativeBox h="16" w="24" />
    </Flex>
  )
}
