import { Flex as PandaFlex, type FlexProps as PandaFlexProps } from 'styled-system/jsx'

export interface FlexProps extends PandaFlexProps {}

export const Flex = PandaFlex
Flex.displayName = 'Flex'
