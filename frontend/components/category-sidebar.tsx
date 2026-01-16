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

interface CategorySidebarProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategorySidebar({ selectedCategory, onSelectCategory }: CategorySidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24">
        <h2 className="text-lg font-semibold text-foreground mb-4">Categories</h2>
        <nav className="space-y-1">
          {categories.map((category) => {
            const Icon = iconMap[category.icon]
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                  selectedCategory === category.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{category.name}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
