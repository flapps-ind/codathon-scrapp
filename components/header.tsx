"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaf, Plus, LogOut, User, Search, X, List } from "lucide-react"
import { isAuthenticated, logout } from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onUploadClick?: () => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function Header({ onUploadClick, searchQuery = "", onSearchChange }: HeaderProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
  }, [])

  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    router.push("/login")
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange?.(localSearch)
  }

  const handleClearSearch = () => {
    setLocalSearch("")
    onSearchChange?.("")
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">Scrapp</span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by tags (e.g. wooden, kitchen, outdoor)"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-9 pr-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          <div className="flex items-center gap-3 shrink-0">
            {isLoggedIn ? (
              <>
                <Button onClick={onUploadClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Give Away</span>
                  <span className="sm:hidden">Add</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/my-listings"
                        className="flex items-center text-foreground focus:bg-secondary cursor-pointer"
                      >
                        <List className="w-4 h-4 mr-2" />
                        My Listings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-foreground focus:bg-secondary cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-foreground hover:bg-secondary">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
