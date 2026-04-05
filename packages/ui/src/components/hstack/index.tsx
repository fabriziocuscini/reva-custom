import { HStack as PandaHStack, type HstackProps as PandaHstackProps } from 'styled-system/jsx'

export interface HStackProps extends PandaHstackProps {}

export const HStack = PandaHStack
HStack.displayName = 'HStack'
