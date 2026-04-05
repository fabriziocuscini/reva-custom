import {
  LinkOverlay as PandaLinkOverlay,
  type LinkOverlayProps as PandaLinkOverlayProps,
} from 'styled-system/jsx'

export interface LinkOverlayProps extends PandaLinkOverlayProps {}

export const LinkOverlay = PandaLinkOverlay
LinkOverlay.displayName = 'LinkOverlay'
