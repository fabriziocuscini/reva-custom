'use client'

import { Badge } from '@reva/ui'

export const code = `<Badge color="neutral">Neutral</Badge>
<Badge color="brand">Brand</Badge>
<Badge color="accent">Accent</Badge>
<Badge color="error">Error</Badge>
<Badge color="warning">Warning</Badge>
<Badge color="success">Success</Badge>
<Badge color="info">Info</Badge>`

export default function BadgeColors() {
  return (
    <>
      <Badge color="neutral">Neutral</Badge>
      <Badge color="brand">Brand</Badge>
      <Badge color="accent">Accent</Badge>
      <Badge color="error">Error</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="success">Success</Badge>
      <Badge color="info">Info</Badge>
    </>
  )
}
