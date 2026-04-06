import {
  GridItem as BaseGridItem,
  type GridItemProps as BaseGridItemProps,
} from 'styled-system/jsx'

export interface GridItemProps extends BaseGridItemProps {}

export const GridItem = BaseGridItem
GridItem.displayName = 'GridItem'
