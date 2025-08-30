import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import { hashPassword, generateToken, generateId } from "@/lib/auth"
import type { User } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone, city } = await request.json()

    // Check if user already exists
    const existingUser = dataStore.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const user: User = {
      id: generateId(),
      email,
      password: hashPassword(password),
      name,
      phone,
      city,
      role: "user",
      createdAt: new Date().toISOString(),
    }

    dataStore.addUser(user)

    // Generate token
    const token = generateToken(user)

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
