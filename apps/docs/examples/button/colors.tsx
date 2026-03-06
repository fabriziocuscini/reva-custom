'use client'

import { Button } from '@reva/ui'

export const code = `<Button color="accent">Accent</Button>
<Button color="neutral">Neutral</Button>
<Button color="error">Error</Button>
<Button color="success">Success</Button>
<Button color="warning">Warning</Button>
<Button color="info">Info</Button>`

export default function ButtonColors() {
  return (
    <>
      <Button color="accent">Accent</Button>
      <Button color="neutral">Neutral</Button>
      <Button color="error">Error</Button>
      <Button color="success">Success</Button>
      <Button color="warning">Warning</Button>
      <Button color="info">Info</Button>
    </>
  )
}
