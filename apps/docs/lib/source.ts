import { docs } from '@/.source/server'
import { loader } from 'fumadocs-core/source'
import { icons } from 'lucide-react'
import { createElement } from 'react'

const iconColors: Record<string, string> = {
  PanelsTopLeft: 'var(--colors-brand-solid)',
  Palette: 'var(--colors-info-solid)',
}

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons], icon in iconColors ? { style: { color: iconColors[icon] } } : undefined)
  },
})
