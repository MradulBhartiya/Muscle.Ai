// ./component/UploadVideo.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

type Props = {
  onSelect?: (file: File | null) => void
  setuploadVideo?: Dispatch<SetStateAction<boolean>>
  setstart?: Dispatch<SetStateAction<boolean>>
  accept?: string
}

export default function UploadVideo({
  onSelect,
  setuploadVideo,
  setstart,
  accept = 'video/*',
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      onSelect?.(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    onSelect?.(file)
    return () => {
      URL.revokeObjectURL(url)
      setPreviewUrl(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  useEffect(() => {
    return () => {
      // cleanup any leftover URL on unmount
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const f = files[0]
    if (!f.type.startsWith('video/')) return
    setFile(f)
    setuploadVideo?.(true)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  function clear() {
    setFile(null)
    setuploadVideo?.(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="w-full h-full overflow-hidden rounded-xl bg-gray-900 relative">
      {/* Drop / preview area */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`w-full h-full flex items-center justify-center transition-all duration-150 ${
          isDragging ? 'ring-4 ring-offset-2 ring-blue-500/30' : ''
        }`}
      >
        {previewUrl ? (
          // Video preview (fills parent, covers like background)
          <video
            src={previewUrl}
            controls
            className="w-full h-full object-cover"
            playsInline
            autoPlay={false}
          />
        ) : (
          // Empty state UI
          <div className="flex flex-col items-center gap-4 text-center px-6">
            <div className="w-28 h-28 rounded-full bg-white/8 flex items-center justify-center">
              {/* simple icon (SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12 text-white/80"
              >
                <path d="M15 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-4.5l4 4v-11l-4 4z" />
              </svg>
            </div>

            <div className="text-white/90">
              <h3 className="text-lg font-medium">Drop a video here</h3>
              <p className="text-sm text-white/70">
                Or browse to select a file (MP4, MOV, WEBM...). Max file size depends on your
                app/backend settings.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Choose file
              </button>

              <button
                type="button"
                onClick={() => {setuploadVideo?.(false);setstart?.(true)}}
                className="px-4 py-2 bg-white/10 text-white rounded-lg shadow hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Small footer overlay with filename + clear button */}
      {file && (
        <div className="absolute left-3 right-3 bottom-3 bg-black/50 backdrop-blur-sm rounded-md px-3 py-2 flex items-center justify-between gap-3">
          <div className="truncate text-white text-sm">
            {file.name} • {(file.size / (1024 * 1024)).toFixed(2)} MB
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1 text-sm rounded-md bg-white/10 text-white hover:bg-white/20 transition"
            >
              Change
            </button>
            <button
              type="button"
              onClick={clear}
              className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
