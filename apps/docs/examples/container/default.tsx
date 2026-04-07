'use client'

import { Box, Container } from '@reva/ui'

export const code = `<Container>
  <Box p="4" bg="neutral.bg.muted" rounded="md">
    Content within a Container
  </Box>
</Container>`

export default function ContainerDefault() {
  return (
    <Container>
      <Box p="4" bg="neutral.bg.muted" rounded="md">
        Content within a Container
      </Box>
    </Container>
  )
}
