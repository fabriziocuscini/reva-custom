'use client'

import { Box, Flex, Spacer } from '@reva/ui'

export const code = `<Flex direction="column" h="xs">
  <Box p="4" bg="bg.subtle" rounded="md">Top</Box>
  <Spacer />
  <Box p="4" bg="bg.subtle" rounded="md">Bottom</Box>
</Flex>`

export default function SpacerVertical() {
  return (
    <Flex direction="column" h="xs">
      <Box p="4" bg="bg.subtle" rounded="md">
        Top
      </Box>
      <Spacer />
      <Box p="4" bg="bg.subtle" rounded="md">
        Bottom
      </Box>
    </Flex>
  )
}
