import { Package, MapPin } from "lucide-react"

interface EmptyStateProps {
  type: "no-items" | "no-results"
  categoryName?: string
}

export function EmptyState({ type, categoryName }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
        {type === "no-items" ? (
          <MapPin className="w-10 h-10 text-muted-foreground" />
        ) : (
          <Package className="w-10 h-10 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {type === "no-items" ? "No items nearby" : `No ${categoryName || "items"} found`}
      </h3>
      <p className="text-muted-foreground max-w-sm">
        {type === "no-items"
          ? "There are no items available in your area right now. Check back later or be the first to give something away!"
          : "Try selecting a different category or check back later for new items."}
      </p>
    </div>
  )
}
