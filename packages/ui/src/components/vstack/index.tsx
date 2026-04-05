import { VStack as PandaVStack, type VstackProps as PandaVstackProps } from 'styled-system/jsx'

export interface VStackProps extends PandaVstackProps {}

export const VStack = PandaVStack
VStack.displayName = 'VStack'
