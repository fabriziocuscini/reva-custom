'use client'

import { Box, Container } from '@reva/ui'

export const code = `<Container>
  <Box p="4" bg="bg.subtle" rounded="md">
    Content within a Container
  </Box>
</Container>`

export default function ContainerDefault() {
  return (
    <Container>
      <Box p="4" bg="bg.subtle" rounded="md">
        Content within a Container
      </Box>
    </Container>
  )
}
