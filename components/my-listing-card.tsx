"use client"

import Image from "next/image"
import { Clock, Leaf, MessageSquare, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { MyListing } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface MyListingCardProps {
  listing: MyListing
  onMarkGiven: (id: string) => void
  onDelete: (id: string) => void
}

export function MyListingCard({ listing, onMarkGiven, onDelete }: MyListingCardProps) {
  const isExpired = listing.expires_in_hours <= 0

  const getStatus = () => {
    if (listing.claimed) return "claimed"
    if (isExpired) return "expired"
    return "available"
  }

  const status = getStatus()

  const statusConfig = {
    available: {
      badge: "Available",
      className: "bg-primary/20 text-primary",
    },
    claimed: {
      badge: "Claimed",
      className: "bg-accent/20 text-accent",
    },
    expired: {
      badge: "Expired",
      className: "bg-destructive/20 text-destructive",
    },
  }

  const formatTime = (hours: number) => {
    if (hours <= 0) return "Expired"
    if (hours < 24) return `${hours}h left`
    const days = Math.floor(hours / 24)
    return `${days}d left`
  }

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl overflow-hidden transition-colors",
        isExpired && "opacity-60",
      )}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0">
          <Image src={listing.image || "/placeholder.svg"} alt={listing.name} fill className="object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground text-lg">{listing.name}</h3>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{listing.caption}</p>
            </div>
            <Badge className={cn("shrink-0", statusConfig[status].className)}>{statusConfig[status].badge}</Badge>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-primary" />
              <span>{listing.co2_saved}kg CO₂ saved</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(listing.expires_in_hours)}</span>
            </div>
          </div>

          {/* Contact Status */}
          <div className="flex items-center gap-2 mt-3">
            {listing.contacted ? (
              <div className="flex items-center gap-1.5 text-sm text-accent">
                <MessageSquare className="w-4 h-4" />
                <span>Someone has contacted you</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                <span>No one contacted yet</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {status === "available" && (
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => onMarkGiven(listing.id)}
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Mark as Given Away
              </Button>
            )}
            {status === "claimed" && (
              <div className="flex items-center gap-1.5 text-sm text-accent">
                <CheckCircle className="w-4 h-4" />
                <span>Claimed by user</span>
              </div>
            )}
            {status === "expired" && (
              <div className="flex items-center gap-1.5 text-sm text-destructive">
                <AlertTriangle className="w-4 h-4" />
                <span>This listing has expired</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
