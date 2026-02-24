import { ark } from '@ark-ui/react/factory'
import { forwardRef } from 'react'
import { cx } from 'styled-system/css'
import { button, type ButtonVariantProps } from 'styled-system/recipes'

// TODO: Remove cast when Ark UI ships types compiled against React 19
const ArkButton = ark.button as React.ForwardRefExoticComponent<
  React.ComponentProps<'button'> & React.RefAttributes<HTMLButtonElement>
>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, ...props }, ref) => (
    <ArkButton
      ref={ref}
      className={cx(button({ variant, size }), className)}
      {...props}
    />
  ),
)

Button.displayName = 'Button'
