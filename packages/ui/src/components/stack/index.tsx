import {
  Stack as BaseStack,
  type StackProps as BaseStackProps,
} from 'styled-system/jsx'
import { Divider } from '../divider'
import {
  Children,
  Fragment,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
} from 'react'

export type StackSeparatorElement = ReactElement<{
  orientation?: 'horizontal' | 'vertical'
}>

export interface StackProps extends BaseStackProps {
  separator?: boolean | StackSeparatorElement
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ separator, children, direction, ...rest }, ref) => {
    if (!separator) {
      return (
        <BaseStack ref={ref} direction={direction} {...rest}>
          {children}
        </BaseStack>
      )
    }

    const resolvedDirection =
      typeof direction === 'string' ? direction : 'column'
    const orientation =
      resolvedDirection === 'row' || resolvedDirection === 'row-reverse'
        ? 'vertical'
        : 'horizontal'
    const separatorElement =
      separator === true ? (
        <Divider orientation={orientation} />
      ) : (
        cloneElement(separator, { orientation })
      )

    const items = Children.toArray(children).filter(isValidElement)

    return (
      <BaseStack ref={ref} direction={direction} {...rest}>
        {items.map((child, i) => (
          <Fragment key={i}>
            {child}
            {i < items.length - 1 && separatorElement}
          </Fragment>
        ))}
      </BaseStack>
    )
  },
)
Stack.displayName = 'Stack'
