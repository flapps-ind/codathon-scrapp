"use client"

import Image from "next/image"
import { Clock, MapPin, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Item } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface ItemCardProps {
  item: Item
  onClaim: (id: string) => void
  onSelect: (item: Item) => void
  isClaiming?: boolean
}

export function ItemCard({ item, onClaim, onSelect, isClaiming }: ItemCardProps) {
  const urgencyColors = {
    low: "bg-primary/20 text-primary",
    medium: "bg-accent/20 text-accent",
    high: "bg-destructive/20 text-destructive",
  }

  const formatTime = (hours: number) => {
    if (hours < 24) return `${hours}h left`
    const days = Math.floor(hours / 24)
    return `${days}d left`
  }

  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group"
      onClick={() => onSelect(item)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={cn("text-xs font-medium", urgencyColors[item.urgency])}>
            {item.urgency === "high" ? "Urgent" : item.urgency === "medium" ? "Soon" : "Available"}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary/90 text-primary-foreground text-xs font-medium">
            <Leaf className="w-3 h-3 mr-1" />
            {item.co2_saved}kg CO₂
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground text-lg truncate">{item.name}</h3>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{item.caption}</p>

        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{item.distance_km}km</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(item.expires_in_hours)}</span>
          </div>
        </div>

        <Button
          className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={item.claimed || isClaiming}
          onClick={(e) => {
            e.stopPropagation()
            onClaim(item.id)
          }}
        >
          {item.claimed ? "Claimed" : isClaiming ? "Claiming..." : "Claim Item"}
        </Button>
      </div>
    </div>
  )
}
