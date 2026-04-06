import {
  Container as BaseContainer,
  type ContainerProps as BaseContainerProps,
} from 'styled-system/jsx'

export interface ContainerProps extends BaseContainerProps {}

export const Container = BaseContainer
Container.displayName = 'Container'
