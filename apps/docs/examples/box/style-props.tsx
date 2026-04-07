'use client'

import { Box } from '@reva/ui'

export const code = `<Box
  mt="4"
  p="6"
  bg="bg.subtle"
  border="1px solid"
  borderColor="border.default"
  rounded="lg"
  color="fg.default"
  shadow="sm"
>
  Box with various style props
</Box>`

export default function BoxStyleProps() {
  return (
    <Box
      mt="4"
      p="6"
      bg="bg.subtle"
      border="1px solid"
      borderColor="border.default"
      rounded="lg"
      color="fg.default"
      shadow="sm"
    >
      Box with various style props
    </Box>
  )
}
