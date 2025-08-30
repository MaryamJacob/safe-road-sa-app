import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import { verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    const updates = await request.json()
    dataStore.updateReport(params.id, updates)

    const reports = dataStore.getReports()
    const updatedReport = reports.find((r) => r.id === params.id)

    return NextResponse.json(updatedReport)
  } catch (error) {
    console.error("Update report error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
