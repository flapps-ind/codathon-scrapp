"use client"

import type React from "react"

import { cn } from "@/frontend/lib/utils"
import { categories } from "@/frontend/lib/mock-data"
import { Grid3X3, Sofa, Tv, Shirt, Dumbbell, TreeDeciduous, BookOpen, Baby } from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  Grid3X3,
  Sofa,
  Tv,
  Shirt,
  Dumbbell,
  TreeDeciduous,
  BookOpen,
  Baby,
}

interface MobileCategoryBarProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function MobileCategoryBar({ selectedCategory, onSelectCategory }: MobileCategoryBarProps) {
  return (
    <div className="lg:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-2 pb-2">
        {categories.map((category) => {
          const Icon = iconMap[category.icon]
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors shrink-0",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
