"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp, Paperclip, Sparkles, Mic, MicOff, X, Link as LinkIcon, Image, FileText } from "lucide-react"
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
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [inspirationFiles, setInspirationFiles] = useState<InspirationFile[]>([])
  const [showInspirationMenu, setShowInspirationMenu] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onstart = () => {
          setIsListening(true)
        }

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' '
            } else {
              interimTranscript += transcript
            }
          }

          if (finalTranscript) {
            setValue((prev) => prev + finalTranscript)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsRecording(false)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
          if (isRecording) {
            // Restart if still recording
            recognitionRef.current?.start()
          }
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isRecording])

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.')
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
      setIsListening(false)
    } else {
      setIsRecording(true)
      recognitionRef.current.start()
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [value])

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
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
        <Sparkles
          size={18}
          className="mt-0.5 shrink-0 text-primary opacity-60"
          strokeWidth={2}
        />
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Q3 sales pitch, team update, product roadmap..."}
            disabled={disabled}
            rows={1}
            className="min-h-[24px] w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="Describe your presentation"
          />
          {isListening && (
            <div className="absolute -right-2 top-0 flex items-center gap-1">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-xs text-primary font-medium">Recording</span>
            </div>
          )}
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

          <button
            onClick={toggleVoiceInput}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
              isRecording
                ? "bg-primary/10 text-primary animate-pulse"
                : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            )}
            aria-label={isRecording ? "Stop recording" : "Start voice input"}
            disabled={disabled}
          >
            {isRecording ? (
              <MicOff size={16} strokeWidth={1.5} opacity={0.9} />
            ) : (
              <Mic size={16} strokeWidth={1.5} opacity={0.7} />
            )}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
            value.trim()
              ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-95"
              : "bg-secondary text-muted-foreground"
          )}
          aria-label="Send message"
        >
          <ArrowUp size={16} strokeWidth={2.5} opacity={0.7} />
        </button>
      </div>
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        {isDragging ? "Drop files here..." : "Attach slides, screenshots, or links to guide the AI"}
      </p>
    </div>
  )
}
