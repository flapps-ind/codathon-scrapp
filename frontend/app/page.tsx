"use client"

import { useState } from "react"
import { Header } from "@/frontend/components/header"
import { MarketplaceFeed } from "@/frontend/components/marketplace-feed"
import { UploadModal } from "@/frontend/components/upload-modal"

export default function HomePage() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <Header onUploadClick={() => setUploadOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <MarketplaceFeed searchQuery={searchQuery} />
      </div>

      <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  )
}
