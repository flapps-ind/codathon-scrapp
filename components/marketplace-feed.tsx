"use client"

import { useState, useEffect, useCallback } from "react"
import { ItemCard } from "@/components/item-card"
import { ItemCardSkeleton } from "@/components/item-card-skeleton"
import { CategorySidebar } from "@/components/category-sidebar"
import { MobileCategoryBar } from "@/components/mobile-category-bar"
import { ItemDetailModal } from "@/components/item-detail-modal"
import { EmptyState } from "@/components/empty-state"
import { fetchItems, claimItem } from "@/lib/api"
import { categories, type Item } from "@/lib/mock-data"

interface MarketplaceFeedProps {
  searchQuery?: string
}

export function MarketplaceFeed({ searchQuery = "" }: MarketplaceFeedProps) {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [claimingId, setClaimingId] = useState<string | null>(null)

  const loadItems = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchItems(selectedCategory, searchQuery)
      setItems(data)
    } catch (error) {
      console.error("Failed to fetch items:", error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const handleClaim = async (id: string) => {
    setClaimingId(id)
    try {
      const item = items.find((i) => i.id === id)
      const newClaimedState = !item?.claimed

      if (newClaimedState) {
        await claimItem(id)
      }

      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, claimed: newClaimedState } : item)))
      if (selectedItem?.id === id) {
        setSelectedItem((prev) => (prev ? { ...prev, claimed: newClaimedState } : null))
      }
    } catch (error) {
      console.error("Failed to claim item:", error)
    } finally {
      setClaimingId(null)
    }
  }

  const currentCategoryName = categories.find((c) => c.id === selectedCategory)?.name

  const getTitle = () => {
    if (searchQuery) {
      return `Results for "${searchQuery}"`
    }
    return selectedCategory === "all" ? "Items Near You" : currentCategoryName
  }

  return (
    <div className="flex gap-8">
      <CategorySidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      <main className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{getTitle()}</h1>
          <p className="text-muted-foreground mt-1">
            {searchQuery
              ? `Showing items matching tags: ${searchQuery}`
              : "Give items a second life. Reduce waste, save CO₂."}
          </p>
        </div>

        <MobileCategoryBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {[...Array(8)].map((_, i) => (
              <ItemCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            type={searchQuery ? "no-results" : selectedCategory === "all" ? "no-items" : "no-results"}
            categoryName={searchQuery || currentCategoryName}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClaim={handleClaim}
                onSelect={setSelectedItem}
                isClaiming={claimingId === item.id}
              />
            ))}
          </div>
        )}
      </main>

      <ItemDetailModal
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        onClaim={handleClaim}
        isClaiming={claimingId === selectedItem?.id}
      />
    </div>
  )
}
