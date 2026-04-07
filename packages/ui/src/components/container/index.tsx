import { forwardRef } from 'react'
import {
  Container as BaseContainer,
  type ContainerProps as BaseContainerProps,
} from 'styled-system/jsx'

export interface ContainerProps extends BaseContainerProps {
  centerContent?: boolean
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ centerContent, ...rest }, ref) {
    return (
      <BaseContainer
        ref={ref}
        {...(centerContent
          ? { display: 'flex', alignItems: 'center', justifyContent: 'center' }
          : {})}
        {...rest}
      />
    )
  },
)
Container.displayName = 'Container'
