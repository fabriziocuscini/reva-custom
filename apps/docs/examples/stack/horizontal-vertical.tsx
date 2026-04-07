'use client'

import { DecorativeBox, HStack, VStack } from '@reva/ui'

export const code = `{/* HStack — horizontal, items centred vertically */}
<HStack gap="4">
  <DecorativeBox h="16" w="16" />
  <DecorativeBox h="16" w="16" />
  <DecorativeBox h="16" w="16" />
</HStack>

{/* VStack — vertical, items centred horizontally */}
<VStack gap="4">
  <DecorativeBox h="8" w="full" />
  <DecorativeBox h="8" w="full" />
  <DecorativeBox h="8" w="full" />
</VStack>`

export default function StackHorizontalVertical() {
  return (
    <VStack gap="6" w="full" alignItems="stretch">
      <HStack gap="4">
        <DecorativeBox h="16" w="16" />
        <DecorativeBox h="16" w="16" />
        <DecorativeBox h="16" w="16" />
      </HStack>
      <VStack gap="4">
        <DecorativeBox h="8" w="full" />
        <DecorativeBox h="8" w="full" />
        <DecorativeBox h="8" w="full" />
      </VStack>
    </VStack>
  )
}
