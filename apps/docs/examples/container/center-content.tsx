'use client'

import { Container } from '@reva/ui'

export const code = `<Container centerContent h="32" bg="bg.muted" rounded="md">
  Centred both horizontally and vertically
</Container>`

export default function ContainerCenterContent() {
  return (
    <Container centerContent h="32" bg="bg.muted" rounded="md">
      Centred both horizontally and vertically
    </Container>
  )
}
