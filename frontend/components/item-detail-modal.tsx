"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/frontend/components/ui/dialog"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { Clock, MapPin, Leaf, AlertTriangle, Check, Loader2 } from "lucide-react"
import type { Item } from "@/frontend/lib/mock-data"
import { cn } from "@/frontend/lib/utils"

interface ItemDetailModalProps {
  item: Item | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onClaim: (id: string) => void
  isClaiming?: boolean
}

export function ItemDetailModal({ item, open, onOpenChange, onClaim, isClaiming }: ItemDetailModalProps) {
  if (!item) return null

  const urgencyColors = {
    low: "bg-primary/20 text-primary",
    medium: "bg-accent/20 text-accent",
    high: "bg-destructive/20 text-destructive",
  }

  const formatTime = (hours: number) => {
    if (hours < 24) return `${hours} hours`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days} days`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">{item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            <div className="absolute top-3 right-3">
              <Badge className="bg-primary/90 text-primary-foreground">
                <Leaf className="w-3 h-3 mr-1" />
                {item.co2_saved}kg CO₂ saved
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className={cn(urgencyColors[item.urgency])}>
                <AlertTriangle className="w-3 h-3 mr-1" />
                {item.urgency === "high"
                  ? "High Urgency"
                  : item.urgency === "medium"
                    ? "Medium Urgency"
                    : "Low Urgency"}
              </Badge>
              <Badge className="bg-secondary text-secondary-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(item.expires_in_hours)} remaining
              </Badge>
              <Badge className="bg-secondary text-secondary-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                {item.distance_km}km away
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{item.caption}</p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-foreground mb-2">Environmental Impact</h3>
              <p className="text-muted-foreground text-sm">
                By claiming this item, you help save approximately{" "}
                <span className="text-primary font-semibold">{item.co2_saved}kg of CO₂</span> from entering the
                atmosphere. {"That's"} equivalent to planting {Math.round(item.co2_saved / 2)} trees!
              </p>
            </div>

            {item.claimed ? (
              <div className="bg-primary/10 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">This item has been claimed</p>
                  <p className="text-sm text-muted-foreground">The owner will contact you with pickup details.</p>
                </div>
              </div>
            ) : (
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                disabled={isClaiming}
                onClick={() => onClaim(item.id)}
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Claiming...
                  </>
                ) : (
                  "Claim This Item"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
