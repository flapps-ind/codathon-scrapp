"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { MyListingCard } from "@/components/my-listing-card"
import { MyListingSkeleton } from "@/components/my-listing-skeleton"
import { Button } from "@/components/ui/button"
import { Package, Plus } from "lucide-react"
import { isAuthenticated } from "@/lib/api"
import { mockMyListings, type MyListing } from "@/lib/mock-data"

export default function MyListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<MyListing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    // Simulate API call: GET /api/items/mine
    const fetchListings = async () => {
      setIsLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))
      setListings(mockMyListings)
      setIsLoading(false)
    }

    fetchListings()
  }, [router])

  const handleMarkGiven = async (id: string) => {
    // Simulate API call: POST /api/items/mark-given
    setListings((prev) => prev.map((listing) => (listing.id === id ? { ...listing, claimed: true } : listing)))
  }

  const handleDelete = async (id: string) => {
    // Simulate API call: POST /api/items/delete
    setListings((prev) => prev.filter((listing) => listing.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Listings</h1>
            <p className="text-muted-foreground mt-1">Manage items you&apos;ve listed for others to claim</p>
          </div>
          <Button onClick={() => router.push("/")} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Listing
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <MyListingSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">You haven&apos;t listed any items yet</h2>
            <p className="text-muted-foreground mt-1 max-w-sm">
              Start giving away items you no longer need and help reduce waste in your community.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              List Your First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <MyListingCard key={listing.id} listing={listing} onMarkGiven={handleMarkGiven} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
