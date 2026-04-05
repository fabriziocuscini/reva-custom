import {
  GridItem as PandaGridItem,
  type GridItemProps as PandaGridItemProps,
} from 'styled-system/jsx'

export interface GridItemProps extends PandaGridItemProps {}

export const GridItem = PandaGridItem
GridItem.displayName = 'GridItem'
