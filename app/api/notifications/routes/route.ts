import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const data = dataStore.getData()
    const userRoutes = data.routes.filter((route) => route.userId === decoded.userId)

    return NextResponse.json({ routes: userRoutes })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch routes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { name, from, to } = await request.json()

    const newRoute = {
      id: Date.now().toString(),
      userId: decoded.userId,
      name,
      from,
      to,
      active: true,
      createdAt: new Date().toISOString(),
    }

    const data = dataStore.getData()
    data.routes.push(newRoute)
    dataStore.saveData(data)

    return NextResponse.json({ route: newRoute })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create route" }, { status: 500 })
  }
}
