"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BrandLogoUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
}

export default function BrandLogoUpload({ value, onChange, disabled }: BrandLogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string>(value || "")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      if (result.success) {
        onChange(result.data.url)
        setPreview(result.data.url)
      } else {
        alert(result.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="cursor-pointer"
      />
      {isUploading && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}
      {preview && (
        <div className="mt-2">
          <img 
            src={preview} 
            alt="Logo preview" 
            className="w-20 h-20 object-contain border rounded-md"
          />
        </div>
      )}
    </div>
  )
} 