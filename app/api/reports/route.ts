import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import { verifyToken, generateId } from "@/lib/auth"
import type { Report } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const reports = dataStore.getReports()
    return NextResponse.json(reports)
  } catch (error) {
    console.error("Get reports error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const reportData = await request.json()

    const report: Report = {
      id: generateId(),
      userId: decoded.userId,
      ...reportData,
      status: "pending",
      upvotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dataStore.addReport(report)

    return NextResponse.json(report)
  } catch (error) {
    console.error("Create report error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
