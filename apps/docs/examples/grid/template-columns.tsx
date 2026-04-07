'use client'

import { DecorativeBox, Grid } from '@reva/ui'

export const code = `<Grid gridTemplateColumns="200px 1fr 1fr" gap="4">
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
</Grid>`

export default function GridTemplateColumns() {
  return (
    <Grid gridTemplateColumns="200px 1fr 1fr" gap="4">
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
    </Grid>
  )
}
