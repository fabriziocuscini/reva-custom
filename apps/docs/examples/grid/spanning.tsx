'use client'

import { DecorativeBox, Grid, GridItem } from '@reva/ui'

export const code = `<Grid columns={4} gap="4">
  <GridItem colSpan={2}>
    <DecorativeBox h="16" />
  </GridItem>
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <GridItem colSpan={3}>
    <DecorativeBox h="16" />
  </GridItem>
</Grid>`

export default function GridSpanning() {
  return (
    <Grid columns={4} gap="4">
      <GridItem colSpan={2}>
        <DecorativeBox h="16" />
      </GridItem>
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <GridItem colSpan={3}>
        <DecorativeBox h="16" />
      </GridItem>
    </Grid>
  )
}
