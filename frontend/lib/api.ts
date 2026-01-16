import { mockItems, type Item } from "./mock-data"

const API_BASE = "/api"

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error("Login failed")
    const data = await res.json()
    localStorage.setItem("scrapp_token", data.token)
    return data
  } catch {
    // Mock fallback
    await delay(800)
    const mockToken = `mock_token_${Date.now()}`
    localStorage.setItem("scrapp_token", mockToken)
    return { token: mockToken, user: { email, name: email.split("@")[0] } }
  }
}

export async function signupUser(name: string, email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) throw new Error("Signup failed")
    const data = await res.json()
    localStorage.setItem("scrapp_token", data.token)
    return data
  } catch {
    // Mock fallback
    await delay(800)
    const mockToken = `mock_token_${Date.now()}`
    localStorage.setItem("scrapp_token", mockToken)
    return { token: mockToken, user: { email, name } }
  }
}

export async function fetchItems(category?: string, searchQuery?: string): Promise<Item[]> {
  try {
    const params = new URLSearchParams()
    if (category && category !== "all") params.set("category", category)
    if (searchQuery) params.set("search", searchQuery)
    const url = params.toString() ? `${API_BASE}/items?${params}` : `${API_BASE}/items`
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch items")
    return res.json()
  } catch {
    // Mock fallback with tag-based search
    await delay(500)
    let results = [...mockItems]

    if (category && category !== "all") {
      results = results.filter((item) => item.category === category)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim()
      results = results.filter(
        (item) =>
          item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          item.name.toLowerCase().includes(query) ||
          item.caption.toLowerCase().includes(query),
      )
    }

    return results
  }
}

export async function uploadItem(file: File): Promise<{
  name: string
  caption: string
  reuse_suggestions: string[]
  co2_saved: number
  urgency: "low" | "medium" | "high"
  expires_in_hours: number
}> {
  try {
    const formData = new FormData()
    formData.append("image", file)
    const res = await fetch(`${API_BASE}/items/upload`, {
      method: "POST",
      body: formData,
    })
    if (!res.ok) throw new Error("Upload failed")
    return res.json()
  } catch {
    // Mock AI response
    await delay(1500)
    return {
      name: "Detected Item",
      caption: "AI-generated description of your item. This eco-friendly item can help reduce waste in your community.",
      reuse_suggestions: ["Donate to local charity", "Upcycle into garden planter", "Give to neighbor"],
      co2_saved: Math.round(Math.random() * 30 + 5),
      urgency: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
      expires_in_hours: [12, 24, 48, 72, 96][Math.floor(Math.random() * 5)],
    }
  }
}

export async function claimItem(itemId: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/items/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    })
    if (!res.ok) throw new Error("Claim failed")
    return res.json()
  } catch {
    // Mock fallback
    await delay(600)
    return { success: true }
  }
}

export function logout() {
  localStorage.removeItem("scrapp_token")
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("scrapp_token")
}
