import { Square as PandaSquare, type SquareProps as PandaSquareProps } from 'styled-system/jsx'

export interface SquareProps extends PandaSquareProps {}

export const Square = PandaSquare
Square.displayName = 'Square'
