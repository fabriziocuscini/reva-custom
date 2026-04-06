'use client'

import { DecorativeBox, Grid } from '@reva/ui'

export const code = `<Grid columns={3} gap="3" gridTemplateRows="repeat(2, 64px)" width="auto">
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
</Grid>`

export default function DecorativeBoxGrid() {
  return (
    <Grid columns={3} gap="3" gridTemplateRows="repeat(2, 64px)" width="auto">
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Grid>
  )
}
