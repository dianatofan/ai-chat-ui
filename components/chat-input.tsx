"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp, Paperclip, X, Link as LinkIcon, Image, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface InspirationFile {
  id: string
  name: string
  type: 'image' | 'file' | 'link'
  preview?: string
  url?: string
}

interface ChatInputProps {
  onSubmit: (value: string) => void
  disabled?: boolean
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const MAX_PROMPT_CHARS = 4000
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [inspirationFiles, setInspirationFiles] = useState<InspirationFile[]>([])
  const [showInspirationMenu, setShowInspirationMenu] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [value])

  const handleSubmit = () => {
    if (value.trim() && value.length <= MAX_PROMPT_CHARS && !disabled) {
      onSubmit(value.trim())
      setValue("")
      setInspirationFiles([])
    }
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const fileType = file.type.startsWith('image/') ? 'image' : 'file'
      const reader = new FileReader()

      reader.onload = (e) => {
        const newFile: InspirationFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: fileType,
          preview: fileType === 'image' ? e.target?.result as string : undefined,
        }
        setInspirationFiles((prev) => [...prev, newFile])
      }

      reader.readAsDataURL(file)
    })
    setShowInspirationMenu(false)
  }

  const handleLinkAdd = () => {
    const link = prompt('Enter a link to inspiration (e.g., Pinterest, deck, webpage):')
    if (link && link.trim()) {
      const newLink: InspirationFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: link,
        type: 'link',
        url: link,
      }
      setInspirationFiles((prev) => [...prev, newLink])
    }
    setShowInspirationMenu(false)
  }

  const removeInspirationFile = (id: string) => {
    setInspirationFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChipClick = (chipText: string) => {
    const currentValue = value.trim()
    const newValue = currentValue ? `${currentValue} ${chipText}` : chipText
    setValue(newValue)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col rounded-2xl border bg-card transition-all duration-200",
          isFocused
            ? "border-primary/30 shadow-[0_0_0_3px_rgba(51,85,245,0.08)]"
            : "border-border shadow-[var(--shadow-light-100)]",
          isDragging && "border-primary/50 bg-primary/5"
        )}
      >
        {/* Inspiration Files Preview */}
        {inspirationFiles.length > 0 && (
          <div className="border-b border-border/50 px-4 pt-4 pb-3">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Attached inspiration:</p>
            <div className="flex flex-wrap gap-2">
              {inspirationFiles.map((file) => (
                <div
                  key={file.id}
                  className="group relative flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 pr-8 text-xs transition-all hover:border-border hover:bg-secondary"
                >
                  {file.type === 'image' && file.preview && (
                    <div className="h-6 w-6 rounded overflow-hidden bg-secondary">
                      <img src={file.preview} alt={file.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  {file.type === 'file' && (
                    <FileText size={14} className="text-muted-foreground" opacity={0.7} />
                  )}
                  {file.type === 'link' && (
                    <LinkIcon size={14} className="text-muted-foreground" opacity={0.7} />
                  )}
                  <span className="text-muted-foreground truncate max-w-[120px]">{file.name}</span>
                  <button
                    onClick={() => removeInspirationFile(file.id)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-md opacity-0 transition-opacity hover:bg-border group-hover:opacity-100"
                  >
                    <X size={12} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-4">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Q3 sales pitch, team update, product roadmap..."
              disabled={disabled}
              rows={1}
              className="min-h-[24px] w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              aria-label="Describe your presentation"
            />
          </div>
        </div>

      <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5">
        <div className="flex items-center gap-1">
          {/* Unified Attach Button */}
          <div className="relative">
            <button
              onClick={() => setShowInspirationMenu(!showInspirationMenu)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              aria-label="Attach inspiration"
            >
              <Paperclip size={16} strokeWidth={1.5} opacity={0.7} />
            </button>

            {/* Inspiration Menu */}
            {showInspirationMenu && (
              <div className="absolute left-0 bottom-full mb-2 z-10 w-48 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-card-foreground transition-colors hover:bg-secondary"
                >
                  <Image size={16} strokeWidth={1.5} opacity={0.7} />
                  <span>Upload slides</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-card-foreground transition-colors hover:bg-secondary"
                >
                  <FileText size={16} strokeWidth={1.5} opacity={0.7} />
                  <span>Upload screenshots</span>
                </button>
                <button
                  onClick={handleLinkAdd}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-card-foreground transition-colors hover:bg-secondary"
                >
                  <LinkIcon size={16} strokeWidth={1.5} opacity={0.7} />
                  <span>Paste link</span>
                </button>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.ppt,.pptx"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs tabular-nums",
              value.length > MAX_PROMPT_CHARS ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {value.length} / {MAX_PROMPT_CHARS}
          </span>
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || value.length > MAX_PROMPT_CHARS || disabled}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
              value.trim() && value.length <= MAX_PROMPT_CHARS
                ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-95"
                : "bg-secondary text-muted-foreground"
            )}
            aria-label="Send message"
          >
            <ArrowUp size={16} strokeWidth={2.5} opacity={0.7} />
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
