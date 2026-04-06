import {
  VisuallyHidden as BaseVisuallyHidden,
  type VisuallyHiddenProps as BaseVisuallyHiddenProps,
} from 'styled-system/jsx'

export interface VisuallyHiddenProps extends BaseVisuallyHiddenProps {}

export const VisuallyHidden = BaseVisuallyHidden
VisuallyHidden.displayName = 'VisuallyHidden'
