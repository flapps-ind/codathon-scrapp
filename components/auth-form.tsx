"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "+91 ",
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const validateMobile = (mobile: string) => {
    const digitsOnly = mobile.replace(/^\+91\s*/, "").replace(/\D/g, "")
    return digitsOnly.length === 10
  }

  const handleMobileChange = (value: string) => {
    if (!value.startsWith("+91")) {
      value = "+91 " + value.replace(/^\+91\s*/, "")
    }
    setFormData({ ...formData, mobile: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    if (mode === "signup" && !validateMobile(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number")
      setIsLoading(false)
      return
    }

    if (mode === "signup" && !formData.name.trim()) {
      setError("Name is required")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
            data: {
              name: formData.name.trim(),
              mobile: formData.mobile,
            },
          },
        })

        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            setError("An account with this email already exists")
          } else {
            setError(signUpError.message)
          }
          return
        }

        // Check if email confirmation is required
        if (data.user && !data.session) {
          setSuccess("Check your email to confirm your account before signing in.")
        } else if (data.session) {
          router.push("/")
          router.refresh()
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            // Check if user exists by trying to get user
            setError("Invalid email or password. Please check your credentials.")
          } else if (signInError.message.includes("Email not confirmed")) {
            setError("Please confirm your email before signing in.")
          } else {
            setError(signInError.message)
          }
          return
        }

        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Scrapp</h1>
          <p className="text-muted-foreground mt-2">
            {mode === "login" ? "Welcome back! Sign in to continue." : "Join the community. Reduce waste together."}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-foreground">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.mobile}
                  onChange={(e) => handleMobileChange(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Your number will be shared with the claimer after an item is claimed.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                minLength={6}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              {mode === "signup" && <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-primary text-sm">{success}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              {mode === "login" ? (
                <>
                  {"Don't have an account? "}
                  <a href="/signup" className="text-primary hover:underline">
                    Sign up
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <a href="/login" className="text-primary hover:underline">
                    Sign in
                  </a>
                </>
              )}
            </p>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          By continuing, you agree to help reduce waste and save the planet.
        </p>
      </div>
    </div>
  )
}
