import {
  VisuallyHidden as PandaVisuallyHidden,
  type VisuallyHiddenProps as PandaVisuallyHiddenProps,
} from 'styled-system/jsx'

export interface VisuallyHiddenProps extends PandaVisuallyHiddenProps {}

export const VisuallyHidden = PandaVisuallyHidden
VisuallyHidden.displayName = 'VisuallyHidden'
