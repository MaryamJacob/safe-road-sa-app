"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Shield,
  BarChart3,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Download,
  MessageSquare,
} from "lucide-react"

// Mock data for admin dashboard
const mockReports = [
  {
    id: "RPT-001",
    type: "Pothole",
    severity: "Urgent",
    location: "Main St & 5th Ave",
    reporter: "John Doe",
    timestamp: "2024-01-15 14:30",
    status: "reported",
    description: "Large pothole causing tire damage",
    upvotes: 12,
    assignedTo: null,
  },
  {
    id: "RPT-002",
    type: "Traffic Light",
    severity: "Urgent",
    location: "Oak St & Pine Ave",
    reporter: "Sarah Miller",
    timestamp: "2024-01-15 13:45",
    status: "in-progress",
    description: "Traffic light completely out",
    upvotes: 8,
    assignedTo: "Municipal Team A",
  },
  {
    id: "RPT-003",
    type: "Obstruction",
    severity: "Medium",
    location: "Elm St near Park",
    reporter: "Mike Roberts",
    timestamp: "2024-01-15 12:15",
    status: "resolved",
    description: "Fallen tree blocking right lane",
    upvotes: 5,
    assignedTo: "Emergency Services",
  },
  {
    id: "RPT-004",
    type: "Infrastructure Request",
    severity: "Low",
    location: "Central Ave & 2nd St",
    reporter: "Lisa Kim",
    timestamp: "2024-01-14 16:20",
    status: "under-review",
    description: "Request for new turning arrow",
    upvotes: 15,
    assignedTo: "Planning Department",
  },
]

const analyticsData = {
  totalReports: 247,
  urgentReports: 23,
  resolvedToday: 12,
  averageResponseTime: "2.4 hours",
  topHotspots: [
    { location: "Main St & 5th Ave", reports: 15, type: "Potholes" },
    { location: "Highway 101", reports: 12, type: "Traffic Lights" },
    { location: "Oak St Corridor", reports: 9, type: "Obstructions" },
  ],
  monthlyTrends: [
    { month: "Oct", reports: 45, resolved: 42 },
    { month: "Nov", reports: 52, resolved: 48 },
    { month: "Dec", reports: 38, resolved: 35 },
    { month: "Jan", reports: 67, resolved: 58 },
  ],
}

export default function AdminDashboard() {
  const [selectedReport, setSelectedReport] = useState<(typeof mockReports)[0] | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reported":
        return <Badge variant="destructive">New Report</Badge>
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case "under-review":
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleStatusUpdate = (reportId: string, newStatus: string) => {
    // In a real app, this would update the database
    console.log(`Updating report ${reportId} to status: ${newStatus}`)
  }

  const filteredReports = mockReports.filter((report) => {
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesSeverity = severityFilter === "all" || report.severity.toLowerCase() === severityFilter
    const matchesSearch =
      !searchQuery ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSeverity && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">SafeRoad SA Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-xs">
              Municipal Dashboard
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-6 px-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Manage Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalReports}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Urgent Reports</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{analyticsData.urgentReports}</div>
                  <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{analyticsData.resolvedToday}</div>
                  <p className="text-xs text-muted-foreground">Great progress!</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.averageResponseTime}</div>
                  <p className="text-xs text-muted-foreground">-15% improvement</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Latest community reports requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockReports.slice(0, 4).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{report.location}</div>
                          <div className="text-xs text-muted-foreground">
                            {report.type} • {report.timestamp}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(report.severity)}
                          {getStatusBadge(report.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Hotspots</CardTitle>
                  <CardDescription>Areas with the most reported issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topHotspots.map((hotspot, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-destructive" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{hotspot.location}</div>
                            <div className="text-xs text-muted-foreground">{hotspot.type}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{hotspot.reports} reports</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Management Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Manage Reports</h2>
                <p className="text-muted-foreground">Review and respond to community reports</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="reported">New Reports</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reports Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.location}</TableCell>
                        <TableCell>{report.reporter}</TableCell>
                        <TableCell>{getSeverityBadge(report.severity)}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{report.assignedTo || "Unassigned"}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Manage Report {report.id}</DialogTitle>
                                <DialogDescription>{report.location}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Current Status</Label>
                                    <Select
                                      defaultValue={report.status}
                                      onValueChange={(value) => handleStatusUpdate(report.id, value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="reported">New Report</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="under-review">Under Review</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Assign To</Label>
                                    <Select defaultValue={report.assignedTo || ""}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select team" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="municipal-a">Municipal Team A</SelectItem>
                                        <SelectItem value="municipal-b">Municipal Team B</SelectItem>
                                        <SelectItem value="emergency">Emergency Services</SelectItem>
                                        <SelectItem value="planning">Planning Department</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <p className="text-sm text-muted-foreground p-3 bg-muted rounded">
                                    {report.description}
                                  </p>
                                </div>
                                <div>
                                  <Label>Response Notes</Label>
                                  <Textarea placeholder="Add notes about actions taken or planned..." />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Contact Reporter
                                  </Button>
                                  <Button>Save Changes</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Analytics & Insights</h2>
              <p className="text-muted-foreground">Data-driven insights for resource allocation</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>Reports vs Resolution Rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.monthlyTrends.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month.month}</span>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">
                            {month.reports} reports • {month.resolved} resolved
                          </div>
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(month.resolved / month.reports) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Report Categories</CardTitle>
                  <CardDescription>Distribution by issue type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Potholes</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: "45%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Traffic Lights</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "30%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground">30%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Obstructions</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "15%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground">15%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Infrastructure</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "10%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground">10%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for municipal response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-muted-foreground">Resolution Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">1.8h</div>
                    <div className="text-sm text-muted-foreground">Avg First Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary">4.7/5</div>
                    <div className="text-sm text-muted-foreground">Community Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Resource Management</h2>
              <p className="text-muted-foreground">Manage teams, equipment, and response protocols</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Teams</CardTitle>
                  <CardDescription>Current deployment status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div>
                          <div className="font-medium">Municipal Team A</div>
                          <div className="text-sm text-muted-foreground">Available • 4 members</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div>
                          <div className="font-medium">Municipal Team B</div>
                          <div className="text-sm text-muted-foreground">On Site • 3 members</div>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Deployed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div>
                          <div className="font-medium">Emergency Services</div>
                          <div className="text-sm text-muted-foreground">Emergency Call • 6 members</div>
                        </div>
                      </div>
                      <Badge variant="destructive">Emergency</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Equipment Status</CardTitle>
                  <CardDescription>Available resources and maintenance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Road Repair Vehicles</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">8/10 available</span>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Traffic Control Equipment</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">15/20 available</span>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Emergency Response Units</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">3/5 available</span>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "60%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
