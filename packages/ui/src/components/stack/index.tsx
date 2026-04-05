import { Stack as PandaStack, type StackProps as PandaStackProps } from 'styled-system/jsx'

export interface StackProps extends PandaStackProps {}

export const Stack = PandaStack
Stack.displayName = 'Stack'
