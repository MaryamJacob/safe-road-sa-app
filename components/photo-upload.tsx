"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { X, Upload } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface PhotoUploadProps {
  photos: string[]
  onPhotosChange: (photos: string[]) => void
  maxPhotos?: number
}

export function PhotoUpload({ photos, onPhotosChange, maxPhotos = 3 }: PhotoUploadProps) {
  const { token } = useAuth()
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !token) return

    setUploading(true)
    const newPhotos = [...photos]

    try {
      for (let i = 0; i < files.length && newPhotos.length < maxPhotos; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          newPhotos.push(data.url)
        } else {
          console.error("Failed to upload file:", file.name)
        }
      }

      onPhotosChange(newPhotos)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
      // Reset the input
      event.target.value = ""
    }
  }

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    onPhotosChange(newPhotos)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="photo-upload">Photos (Optional)</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Upload up to {maxPhotos} photos to help illustrate the issue
        </p>

        {photos.length < maxPhotos && (
          <div className="flex items-center gap-2">
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("photo-upload")?.click()}
              disabled={uploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Photos"}
            </Button>
          </div>
        )}
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-2">
                <div className="aspect-square relative rounded-md overflow-hidden bg-muted">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {photos.length >= maxPhotos && (
        <p className="text-sm text-muted-foreground">Maximum number of photos reached ({maxPhotos})</p>
      )}
    </div>
  )
}
