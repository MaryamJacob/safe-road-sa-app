"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Shield, Navigation, Filter, Search, ArrowLeft, Clock, ThumbsUp, Users, Route, Zap } from "lucide-react"
import Link from "next/link"

const reportTypeColors = {
  pothole: "bg-orange-500",
  "traffic-light": "bg-red-500",
  obstruction: "bg-yellow-500",
  debris: "bg-blue-500",
  accident: "bg-purple-500",
  "road-hazard": "bg-orange-500",
  "infrastructure-request": "bg-blue-500",
  "faulty-traffic-light": "bg-red-500",
  "emergency-request": "bg-purple-500",
}

const severityColors = {
  low: "border-green-400",
  minor: "border-green-400",
  medium: "border-yellow-400",
  urgent: "border-red-500",
}

export default function MapPage() {
  const { token } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [filteredReports, setFilteredReports] = useState([])
  const [filters, setFilters] = useState({
    type: "all",
    severity: "all",
    status: "all",
    timeRange: "all",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (response.ok) {
          const data = await response.json()
          const reportsWithLocation = (data.reports || []).map((report: any, index: number) => ({
            ...report,
            // Generate mock coordinates for visualization (in real app, would use geocoding)
            location: {
              x: 20 + ((index * 15) % 60),
              y: 25 + ((index * 20) % 50),
            },
          }))
          setReports(reportsWithLocation)
          setFilteredReports(reportsWithLocation)
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [token])

  useEffect(() => {
    let filtered = reports

    if (filters.type !== "all") {
      filtered = filtered.filter((report: any) => report.type === filters.type)
    }
    if (filters.severity !== "all") {
      filtered = filtered.filter((report: any) => report.severity === filters.severity)
    }
    if (filters.status !== "all") {
      filtered = filtered.filter((report: any) => report.status === filters.status)
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (report: any) =>
          report.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredReports(filtered)
  }, [filters, searchQuery, reports])

  const handleUpvote = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ action: "upvote" }),
      })

      if (response.ok) {
        // Update local state
        setReports(
          reports.map((report: any) =>
            report.id === reportId ? { ...report, upvotes: (report.upvotes || 0) + 1 } : report,
          ),
        )
      }
    } catch (error) {
      console.error("Failed to upvote report:", error)
    }
  }

  const getReportIcon = (type: string) => {
    switch (type) {
      case "pothole":
      case "road-hazard":
        return "🕳️"
      case "traffic-light":
      case "faulty-traffic-light":
        return "🚦"
      case "obstruction":
        return "🚧"
      case "debris":
        return "🗑️"
      case "accident":
      case "emergency-request":
        return "🚨"
      case "infrastructure-request":
        return "🏗️"
      default:
        return "⚠️"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reported":
        return <Badge variant="secondary">Reported</Badge>
      case "verified":
        return <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case "emergency":
        return <Badge variant="destructive">Emergency</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Less than 1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading safety map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-primary">SafeRoad SA</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/report" className="text-sm font-medium hover:text-primary transition-colors">
              Report Issue
            </Link>
            <Link href="/education" className="text-sm font-medium hover:text-primary transition-colors">
              Safety Hub
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 border-r bg-card overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-4">Safety Map</h2>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Toggle */}
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="w-full mb-4">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Filters */}
            {showFilters && (
              <div className="space-y-4 mb-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <label className="text-sm font-medium mb-2 block">Report Type</label>
                  <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="road-hazard">Road Hazards</SelectItem>
                      <SelectItem value="infrastructure-request">Infrastructure</SelectItem>
                      <SelectItem value="faulty-traffic-light">Traffic Lights</SelectItem>
                      <SelectItem value="emergency-request">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Severity</label>
                  <Select
                    value={filters.severity}
                    onValueChange={(value) => setFilters({ ...filters, severity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="reported">Reported</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Card className="p-3">
                <div className="text-2xl font-bold text-destructive">{filteredReports.length}</div>
                <div className="text-xs text-muted-foreground">Active Reports</div>
              </Card>
              <Card className="p-3">
                <div className="text-2xl font-bold text-secondary">
                  {filteredReports.filter((r: any) => r.severity === "urgent").length}
                </div>
                <div className="text-xs text-muted-foreground">Urgent Issues</div>
              </Card>
            </div>
          </div>

          {/* Reports List */}
          <div className="p-4">
            <h3 className="font-medium mb-3">Recent Reports ({filteredReports.length})</h3>
            <div className="space-y-3">
              {filteredReports.map((report: any) => (
                <Card
                  key={report.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedReport(report)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getReportIcon(report.type)}</span>
                        <div>
                          <div className="font-medium text-sm">{report.location}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(report.createdAt)}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        {report.upvotes || 0}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          report.severity === "urgent"
                            ? "border-red-500 text-red-700"
                            : report.severity === "medium"
                              ? "border-yellow-500 text-yellow-700"
                              : "border-green-500 text-green-700"
                        }`}
                      >
                        {report.severity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-gradient-to-br from-green-50 to-blue-50">
          {/* Mock Map */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-gray-100">
            {/* Map Grid Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#94a3b8" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Mock Roads */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-400 opacity-60"></div>
              <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-500 opacity-70"></div>
              <div className="absolute top-3/4 left-0 right-0 h-2 bg-gray-400 opacity-60"></div>
              <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-gray-400 opacity-60"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-3 bg-gray-500 opacity-70"></div>
              <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-gray-400 opacity-60"></div>
            </div>

            {/* Report Markers */}
            {filteredReports.map((report: any) => (
              <div
                key={report.id}
                className={`absolute w-6 h-6 rounded-full border-2 ${severityColors[report.severity] || severityColors.medium} ${
                  reportTypeColors[report.type] || reportTypeColors["road-hazard"]
                } cursor-pointer hover:scale-110 transition-transform shadow-lg flex items-center justify-center text-white text-xs font-bold`}
                style={{
                  left: `${report.location?.x || 50}%`,
                  top: `${report.location?.y || 50}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => setSelectedReport(report)}
              >
                {report.severity === "urgent" && <Zap className="h-3 w-3" />}
              </div>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button size="sm" variant="outline" className="bg-background/90">
              <Navigation className="h-4 w-4 mr-2" />
              My Location
            </Button>
            <Button size="sm" variant="outline" className="bg-background/90">
              <Route className="h-4 w-4 mr-2" />
              Alternate Routes
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur rounded-lg p-4 border">
            <h4 className="font-medium mb-2">Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span>Potholes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Traffic Lights</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>Obstructions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span>Debris</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span>Accidents</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-md">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getReportIcon(selectedReport.type)}</span>
                  {selectedReport.location}
                </DialogTitle>
                <DialogDescription>
                  Reported {formatTimestamp(selectedReport.createdAt)} by {selectedReport.reporterName || "Anonymous"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {getStatusBadge(selectedReport.status)}
                  <Badge
                    variant="outline"
                    className={
                      selectedReport.severity === "urgent"
                        ? "border-red-500 text-red-700"
                        : selectedReport.severity === "medium"
                          ? "border-yellow-500 text-yellow-700"
                          : "border-green-500 text-green-700"
                    }
                  >
                    {selectedReport.severity} severity
                  </Badge>
                </div>
                <p className="text-sm">{selectedReport.description}</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleUpvote(selectedReport.id)}>
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Verify ({selectedReport.upvotes || 0})
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Navigation className="h-4 w-4 mr-1" />
                      Directions
                    </Button>
                    <Button size="sm">
                      <Users className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
