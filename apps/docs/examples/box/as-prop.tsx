'use client'

import { Box } from '@reva/ui'

export const code = `<Box as="section" p="4" bg="neutral.bg.muted" rounded="md">
  Rendered as a &lt;section&gt; element
</Box>`

export default function BoxAsProp() {
  return (
    <Box as="section" p="4" bg="neutral.bg.muted" rounded="md">
      Rendered as a &lt;section&gt; element
    </Box>
  )
}
