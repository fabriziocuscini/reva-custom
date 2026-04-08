'use client'

import { Badge } from '@reva/ui'

const CircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const code = `<Badge iconStart={<CircleIcon />}>With start icon</Badge>
<Badge iconEnd={<CircleIcon />}>With end icon</Badge>
<Badge iconStart={<CheckIcon />} iconEnd={<CircleIcon />}>Both icons</Badge>`

export default function BadgeWithIcons() {
  return (
    <>
      <Badge iconStart={<CircleIcon />}>With start icon</Badge>
      <Badge iconEnd={<CircleIcon />}>With end icon</Badge>
      <Badge iconStart={<CheckIcon />} iconEnd={<CircleIcon />}>Both icons</Badge>
    </>
  )
}
