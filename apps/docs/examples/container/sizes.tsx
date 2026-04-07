'use client'

import { Box, Container, VStack } from '@reva/ui'

export const code = `<VStack gap="4" w="full">
  <Container maxW="sm">
    <Box p="4" bg="bg.muted" rounded="md">sm — 640px</Box>
  </Container>
  <Container maxW="md">
    <Box p="4" bg="bg.muted" rounded="md">md — 768px</Box>
  </Container>
  <Container maxW="lg">
    <Box p="4" bg="bg.muted" rounded="md">lg — 1024px</Box>
  </Container>
  <Container maxW="xl">
    <Box p="4" bg="bg.muted" rounded="md">xl — 1280px</Box>
  </Container>
</VStack>`

export default function ContainerSizes() {
  return (
    <VStack gap="4" w="full">
      <Container maxW="sm">
        <Box p="4" bg="bg.muted" rounded="md">sm — 640px</Box>
      </Container>
      <Container maxW="md">
        <Box p="4" bg="bg.muted" rounded="md">md — 768px</Box>
      </Container>
      <Container maxW="lg">
        <Box p="4" bg="bg.muted" rounded="md">lg — 1024px</Box>
      </Container>
      <Container maxW="xl">
        <Box p="4" bg="bg.muted" rounded="md">xl — 1280px</Box>
      </Container>
    </VStack>
  )
}
