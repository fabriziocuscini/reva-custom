import { ark } from '@ark-ui/react/factory'
import { forwardRef, type ReactNode } from 'react'
import { styled } from 'styled-system/jsx'
import { badge, type BadgeVariantProps } from 'styled-system/recipes'

const StyledBadge = styled(ark.span, badge)

export interface BadgeProps
  extends React.ComponentProps<typeof StyledBadge>,
    BadgeVariantProps {
  iconStart?: ReactNode
  iconEnd?: ReactNode
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, iconStart, iconEnd, ...props }, ref) => (
    <StyledBadge ref={ref} {...props}>
      {iconStart}
      {children}
      {iconEnd}
    </StyledBadge>
  ),
)

Badge.displayName = 'Badge'
