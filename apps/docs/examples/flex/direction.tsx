'use client'

import { DecorativeBox, Flex, VStack } from '@reva/ui'

export const code = `{/* Row (default) */}
<Flex direction="row" gap="4">
  <DecorativeBox h="16" w="24" />
  <DecorativeBox h="16" w="24" />
  <DecorativeBox h="16" w="24" />
</Flex>

{/* Column */}
<Flex direction="column" gap="4">
  <DecorativeBox h="8" />
  <DecorativeBox h="8" />
  <DecorativeBox h="8" />
</Flex>`

export default function FlexDirection() {
  return (
    <VStack gap="6" w="full" alignItems="stretch">
      <Flex direction="row" gap="4">
        <DecorativeBox h="16" w="24" />
        <DecorativeBox h="16" w="24" />
        <DecorativeBox h="16" w="24" />
      </Flex>
      <Flex direction="column" gap="4">
        <DecorativeBox h="8" />
        <DecorativeBox h="8" />
        <DecorativeBox h="8" />
      </Flex>
    </VStack>
  )
}
