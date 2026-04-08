'use client'

import { Badge } from '@reva/ui'

export const code = `<Badge variant="solid">Solid</Badge>
<Badge variant="subtle">Subtle</Badge>
<Badge variant="outline">Outline</Badge>`

export default function BadgeVariants() {
  return (
    <>
      <Badge variant="solid">Solid</Badge>
      <Badge variant="subtle">Subtle</Badge>
      <Badge variant="outline">Outline</Badge>
    </>
  )
}
