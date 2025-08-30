import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import { verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { active } = await request.json()
    const data = dataStore.getData()

    const routeIndex = data.routes.findIndex((route) => route.id === params.id && route.userId === decoded.userId)

    if (routeIndex === -1) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    data.routes[routeIndex].active = active
    dataStore.saveData(data)

    return NextResponse.json({ route: data.routes[routeIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update route" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    const routeIndex = data.routes.findIndex((route) => route.id === params.id && route.userId === decoded.userId)

    if (routeIndex === -1) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    data.routes.splice(routeIndex, 1)
    dataStore.saveData(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete route" }, { status: 500 })
  }
}
