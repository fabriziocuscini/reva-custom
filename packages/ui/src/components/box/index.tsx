import { Box as BaseBox, type BoxProps as BaseBoxProps } from 'styled-system/jsx'

export interface BoxProps extends BaseBoxProps {}

export const Box = BaseBox
Box.displayName = 'Box'
