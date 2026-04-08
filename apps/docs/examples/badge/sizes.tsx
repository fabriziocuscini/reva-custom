'use client'

import { Badge } from '@reva/ui'

export const code = `<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>`

export default function BadgeSizes() {
  return (
    <>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </>
  )
}
