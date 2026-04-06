import { forwardRef } from 'react'
import { Stack, type StackProps } from '../stack'

export interface HStackProps extends StackProps {}

export const HStack = forwardRef<HTMLDivElement, HStackProps>((props, ref) => (
  <Stack align="center" {...props} direction="row" ref={ref} />
))
HStack.displayName = 'HStack'
