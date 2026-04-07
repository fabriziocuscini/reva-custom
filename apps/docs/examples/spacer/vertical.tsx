'use client'

import { Box, Flex, Spacer } from '@reva/ui'

export const code = `<Flex direction="column" h="48">
  <Box p="4" bg="bg.muted" rounded="md">Top</Box>
  <Spacer />
  <Box p="4" bg="bg.muted" rounded="md">Bottom</Box>
</Flex>`

export default function SpacerVertical() {
  return (
    <Flex direction="column" h="48">
      <Box p="4" bg="bg.muted" rounded="md">
        Top
      </Box>
      <Spacer />
      <Box p="4" bg="bg.muted" rounded="md">
        Bottom
      </Box>
    </Flex>
  )
}
