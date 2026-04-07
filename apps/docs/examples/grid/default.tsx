'use client'

import { DecorativeBox, Grid } from '@reva/ui'

export const code = `<Grid columns={3} gap="4">
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
</Grid>`

export default function GridDefault() {
  return (
    <Grid columns={3} gap="4">
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
    </Grid>
  )
}
