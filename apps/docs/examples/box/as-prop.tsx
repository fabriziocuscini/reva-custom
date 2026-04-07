'use client'

import { Box } from '@reva/ui'

export const code = `<Box as="section" p="4" bg="bg.subtle" rounded="md">
  Rendered as a &lt;section&gt; element
</Box>`

export default function BoxAsProp() {
  return (
    <Box as="section" p="4" bg="bg.subtle" rounded="md">
      Rendered as a &lt;section&gt; element
    </Box>
  )
}
