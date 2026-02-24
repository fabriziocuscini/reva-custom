import { ark } from '@ark-ui/react/factory'
import { forwardRef } from 'react'
import { cx } from 'styled-system/css'
import { button, type ButtonVariantProps } from 'styled-system/recipes'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, ...props }, ref) => (
    <ark.button
      ref={ref}
      className={cx(button({ variant, size }), className)}
      {...props}
    />
  ),
)

Button.displayName = 'Button'
