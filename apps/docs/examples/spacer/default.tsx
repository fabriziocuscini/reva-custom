'use client'

import { Box, Flex, Spacer } from '@reva/ui'

export const code = `<Flex w="full">
  <Box p="4" bg="neutral.bg.muted" rounded="md">Left</Box>
  <Spacer />
  <Box p="4" bg="neutral.bg.muted" rounded="md">Right</Box>
</Flex>`

export default function SpacerDefault() {
  return (
    <Flex w="full">
      <Box p="4" bg="neutral.bg.muted" rounded="md">
        Left
      </Box>
      <Spacer />
      <Box p="4" bg="neutral.bg.muted" rounded="md">
        Right
      </Box>
    </Flex>
  )
}
