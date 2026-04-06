import { Square as BaseSquare, type SquareProps as BaseSquareProps } from 'styled-system/jsx'

export interface SquareProps extends BaseSquareProps {}

export const Square = BaseSquare
Square.displayName = 'Square'
