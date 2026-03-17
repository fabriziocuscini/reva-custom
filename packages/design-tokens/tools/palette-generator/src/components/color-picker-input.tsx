import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { isValidHex, normalizeHex } from '@/lib/color'
import type { ClipboardEvent, KeyboardEvent, MouseEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

interface ColorPickerInputProps {
  value: string
  onChange: (hex: string) => void
}

export function ColorPickerInput({ value, onChange }: ColorPickerInputProps) {
  const valid = isValidHex(value)
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  const commit = useCallback(() => {
    const normalized = normalizeHex(draft)
    if (normalized !== value) onChange(normalized)
    setDraft(normalized)
  }, [draft, value, onChange])

  const handleDoubleClick = useCallback((e: MouseEvent<HTMLInputElement>) => {
    e.currentTarget.select()
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.currentTarget.blur()
        commit()
      }
    },
    [commit],
  )

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      const pasted = e.clipboardData.getData('text/plain')
      const input = e.currentTarget
      const before = input.value.slice(0, input.selectionStart ?? 0)
      const after = input.value.slice(input.selectionEnd ?? input.value.length)
      const merged = before + pasted + after
      const normalized = normalizeHex(merged)
      e.preventDefault()
      setDraft(normalized)
      onChange(normalized)
    },
    [onChange],
  )

  return (
    <Popover>
      <InputGroup className="w-28">
        <InputGroupAddon align="inline-start">
          <PopoverTrigger asChild>
            <button
              type="button"
              className="size-4 rounded-sm shrink-0 border border-border cursor-pointer"
              style={{
                backgroundColor: valid ? value : 'var(--muted)',
              }}
              aria-label="Pick a color"
            />
          </PopoverTrigger>
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onDoubleClick={handleDoubleClick}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="font-mono text-xs uppercase"
          aria-invalid={!valid || undefined}
        />
      </InputGroup>
      <PopoverContent side="bottom" align="end" sideOffset={8} className="w-auto p-3">
        <div className="color-picker-wrapper">
          <HexColorPicker color={valid ? value : '#000000'} onChange={onChange} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
