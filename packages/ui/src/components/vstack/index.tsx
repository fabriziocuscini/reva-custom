import { forwardRef } from 'react'
import { Stack, type StackProps } from '../stack'

export interface VStackProps extends StackProps {}

export const VStack = forwardRef<HTMLDivElement, VStackProps>((props, ref) => (
  <Stack align="center" {...props} direction="column" ref={ref} />
))
VStack.displayName = 'VStack'
