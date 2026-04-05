import { Box as PandaBox, type BoxProps as PandaBoxProps } from 'styled-system/jsx'

export interface BoxProps extends PandaBoxProps {}

export const Box = PandaBox
Box.displayName = 'Box'
