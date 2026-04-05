import { Grid as PandaGrid, type GridProps as PandaGridProps } from 'styled-system/jsx'

export interface GridProps extends PandaGridProps {}

export const Grid = PandaGrid
Grid.displayName = 'Grid'
