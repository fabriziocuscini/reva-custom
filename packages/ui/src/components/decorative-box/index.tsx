import { ark } from '@ark-ui/react/factory'
import type { ComponentProps } from 'react'
import { styled } from 'styled-system/jsx'
import { decorativeBox } from 'styled-system/recipes'

export type DecorativeBoxProps = ComponentProps<typeof DecorativeBox>
export const DecorativeBox = styled(ark.div, decorativeBox)
DecorativeBox.displayName = 'DecorativeBox'
