'use client'

import { DecorativeBox, HStack, VStack } from '@reva/ui'

export const code = `<HStack gap="4" alignItems="start" w="full">
  <DecorativeBox h="16" w="24" />
  <DecorativeBox h="16" w="24" />
  <DecorativeBox h="16" w="24" />
</HStack>

<VStack gap="4" alignItems="stretch" w="full">
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
</VStack>`

export default function DecorativeBoxStack() {
  return (
    <VStack gap="6" alignItems="stretch" w="full">
      <HStack gap="4" alignItems="start" w="full">
        <DecorativeBox h="16" w="24" />
        <DecorativeBox h="16" w="24" />
        <DecorativeBox h="16" w="24" />
      </HStack>

      <VStack gap="4" alignItems="stretch" w="full">
        <DecorativeBox h="16" />
        <DecorativeBox h="16" />
        <DecorativeBox h="16" />
      </VStack>
    </VStack>
  )
}
