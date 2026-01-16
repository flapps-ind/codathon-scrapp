"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/frontend/components/ui/dialog"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { Camera, Upload, X, Leaf, Clock, AlertTriangle, Loader2, Check } from "lucide-react"
import { uploadItem } from "@/frontend/lib/api"
import { cn } from "@/frontend/lib/utils"

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

interface UploadResult {
  name: string
  caption: string
  reuse_suggestions: string[]
  co2_saved: number
  urgency: "low" | "medium" | "high"
  expires_in_hours: number
}

export function UploadModal({ open, onOpenChange, onSuccess }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      const data = await uploadItem(selectedFile)
      setResult(data)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleConfirm = () => {
    setIsSubmitted(true)
    setTimeout(() => {
      resetState()
      onOpenChange(false)
      onSuccess?.()
    }, 1500)
  }

  const resetState = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setIsSubmitted(false)
  }

  const handleClose = () => {
    resetState()
    onOpenChange(false)
  }

  const urgencyColors = {
    low: "bg-primary/20 text-primary",
    medium: "bg-accent/20 text-accent",
    high: "bg-destructive/20 text-destructive",
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{result ? "AI Preview" : "Upload Item"}</DialogTitle>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Item Listed!</h3>
            <p className="text-muted-foreground mt-2">Your item is now available for pickup.</p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            {preview && (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{result.name}</h3>
                <p className="text-muted-foreground mt-1">{result.caption}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className={cn(urgencyColors[result.urgency])}>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {result.urgency === "high"
                    ? "High Urgency"
                    : result.urgency === "medium"
                      ? "Medium Urgency"
                      : "Low Urgency"}
                </Badge>
                <Badge className="bg-primary/20 text-primary">
                  <Leaf className="w-3 h-3 mr-1" />
                  {result.co2_saved}kg CO₂ saved
                </Badge>
                <Badge className="bg-secondary text-secondary-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  Expires in {result.expires_in_hours}h
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Reuse Suggestions</h4>
                <ul className="space-y-1">
                  {result.reuse_suggestions.map((suggestion, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
                onClick={() => setResult(null)}
              >
                Edit
              </Button>
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleConfirm}>
                Confirm & List
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {preview ? (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    setPreview(null)
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center hover:bg-background"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium">Click to upload</p>
                <p className="text-muted-foreground text-sm mt-1">or drag and drop</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute("capture", "environment")
                    fileInputRef.current.click()
                  }
                }}
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!selectedFile || isUploading}
                onClick={handleUpload}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Our AI will automatically detect the item, generate a description, and calculate CO₂ savings.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
