'use client'

import { Button } from '@reva/ui'

export const code = `<Button variant="solid">Solid</Button>
<Button variant="subtle">Subtle</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>`

export default function ButtonVariants() {
  return (
    <>
      <Button variant="solid">Solid</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </>
  )
}
