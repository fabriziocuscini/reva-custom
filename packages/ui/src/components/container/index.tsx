import {
  Container as PandaContainer,
  type ContainerProps as PandaContainerProps,
} from 'styled-system/jsx'

export interface ContainerProps extends PandaContainerProps {}

export const Container = PandaContainer
Container.displayName = 'Container'
