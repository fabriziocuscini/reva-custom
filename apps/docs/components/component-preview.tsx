'use client'

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import type { ReactNode } from 'react'

interface ComponentPreviewProps {
  children: ReactNode
  code: string
}

export function ComponentPreview({ children, code }: ComponentPreviewProps) {
  return (
    <div className="not-prose my-6">
      <div className="flex flex-wrap items-center gap-4 rounded-t-xl border border-fd-border bg-fd-background p-8">
        {children}
      </div>
      <div className="[&_figure]:my-0 [&_figure]:rounded-t-none [&_figure]:border-t-0">
        <DynamicCodeBlock lang="tsx" code={code} />
      </div>
    </div>
  )
}
