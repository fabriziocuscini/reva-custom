import { Grid as BaseGrid, type GridProps as BaseGridProps } from 'styled-system/jsx'

export interface GridProps extends BaseGridProps {}

export const Grid = BaseGrid
Grid.displayName = 'Grid'
