import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import type { ReactNode } from 'react'

interface ComponentPreviewProps {
  children: ReactNode
  code: string
}

export function ComponentPreview({ children, code }: ComponentPreviewProps) {
  return (
    <Tabs items={['Preview', 'Code']}>
      <Tab value="Preview">
        <div className="flex flex-wrap items-center gap-4 p-8 ">
          {children}
        </div>
      </Tab>
      <Tab value="Code">
        <pre>
          <code className="language-tsx">{code}</code>
        </pre>
      </Tab>
    </Tabs>
  )
}
