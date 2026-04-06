import {
  LinkOverlay as BaseLinkOverlay,
  type LinkOverlayProps as BaseLinkOverlayProps,
} from 'styled-system/jsx'

export interface LinkOverlayProps extends BaseLinkOverlayProps {}

export const LinkOverlay = BaseLinkOverlay
LinkOverlay.displayName = 'LinkOverlay'
