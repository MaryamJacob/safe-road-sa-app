"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Shield,
  Bell,
  MapPin,
  Route,
  AlertTriangle,
  Clock,
  Settings,
  Plus,
  X,
  ArrowLeft,
  Smartphone,
  Mail,
} from "lucide-react"
import Link from "next/link"

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "urgent",
    title: "Traffic Light Malfunction",
    message: "Traffic light at Main St & 5th Ave is completely out. Use alternate routes.",
    location: "Main St & 5th Ave",
    timestamp: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Large Pothole Reported",
    message: "Multiple users reported a large pothole on your frequent route (Oak St).",
    location: "Oak St near Park",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Route Update",
    message: "Road construction on Elm St has been completed. Normal traffic flow resumed.",
    location: "Elm St",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "safety",
    title: "Safety Alert",
    message: "Increased hijacking reports in Central Ave area. Exercise caution during evening hours.",
    location: "Central Ave",
    timestamp: "1 day ago",
    read: true,
  },
]

const mockRoutes = [
  { id: 1, name: "Home to Work", from: "123 Home St", to: "456 Office Ave", active: true },
  { id: 2, name: "Home to School", from: "123 Home St", to: "789 School Rd", active: true },
  { id: 3, name: "Weekend Route", from: "123 Home St", to: "Mall Plaza", active: false },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [routes, setRoutes] = useState(mockRoutes)
  const [newRoute, setNewRoute] = useState({ name: "", from: "", to: "" })
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
    potholes: true,
    trafficLights: true,
    accidents: true,
    construction: false,
    safety: true,
    infrastructure: false,
  })

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const addRoute = () => {
    if (newRoute.name && newRoute.from && newRoute.to) {
      const route = {
        id: routes.length + 1,
        ...newRoute,
        active: true,
      }
      setRoutes([...routes, route])
      setNewRoute({ name: "", from: "", to: "" })
    }
  }

  const toggleRoute = (id: number) => {
    setRoutes(routes.map((route) => (route.id === id ? { ...route, active: !route.active } : route)))
  }

  const removeRoute = (id: number) => {
    setRoutes(routes.filter((route) => route.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "safety":
        return <Shield className="h-4 w-4 text-secondary" />
      default:
        return <Bell className="h-4 w-4 text-blue-600" />
    }
  }

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case "safety":
        return <Badge className="bg-purple-100 text-purple-800">Safety</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

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
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/report" className="text-sm font-medium hover:text-primary transition-colors">
                Report Issue
              </Link>
              <Link href="/map" className="text-sm font-medium hover:text-primary transition-colors">
                Safety Map
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Notifications & Alerts</h1>
          <p className="text-muted-foreground">
            Stay informed about road safety issues on your routes and in your area.
          </p>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="routes">My Routes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Notifications</h2>
              <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                Mark All Read
              </Button>
            </div>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-colors ${
                    !notification.read ? "border-primary/50 bg-primary/5" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getNotificationBadge(notification.type)}
                        {!notification.read && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {notification.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notification.timestamp}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {notifications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No notifications yet</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll receive notifications about safety issues on your routes and in your area.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Routes Tab */}
          <TabsContent value="routes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Routes</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Route
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Route</DialogTitle>
                    <DialogDescription>
                      Add a route to receive notifications about safety issues along your path.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="route-name">Route Name</Label>
                      <Input
                        id="route-name"
                        placeholder="e.g., Home to Work"
                        value={newRoute.name}
                        onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="route-from">From</Label>
                      <Input
                        id="route-from"
                        placeholder="Starting address"
                        value={newRoute.from}
                        onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="route-to">To</Label>
                      <Input
                        id="route-to"
                        placeholder="Destination address"
                        value={newRoute.to}
                        onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })}
                      />
                    </div>
                    <Button onClick={addRoute} className="w-full">
                      Add Route
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {routes.map((route) => (
                <Card key={route.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Route className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">{route.name}</h3>
                          <Badge variant={route.active ? "default" : "secondary"}>
                            {route.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">From:</span>
                            {route.from}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">To:</span>
                            {route.to}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={route.active} onCheckedChange={() => toggleRoute(route.id)} />
                        <Button variant="ghost" size="sm" onClick={() => removeRoute(route.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {routes.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Route className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No routes added yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your frequent routes to receive targeted safety notifications.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Route
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Route</DialogTitle>
                        <DialogDescription>
                          Add a route to receive notifications about safety issues along your path.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="route-name">Route Name</Label>
                          <Input
                            id="route-name"
                            placeholder="e.g., Home to Work"
                            value={newRoute.name}
                            onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="route-from">From</Label>
                          <Input
                            id="route-from"
                            placeholder="Starting address"
                            value={newRoute.from}
                            onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="route-to">To</Label>
                          <Input
                            id="route-to"
                            placeholder="Destination address"
                            value={newRoute.to}
                            onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })}
                          />
                        </div>
                        <Button onClick={addRoute} className="w-full">
                          Add Route
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-semibold">Notification Settings</h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Delivery Methods
                </CardTitle>
                <CardDescription>Choose how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Instant alerts on your device</p>
                    </div>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Daily summary emails</p>
                    </div>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Text messages for urgent alerts only</p>
                    </div>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Types</CardTitle>
                <CardDescription>Choose which types of safety issues you want to be notified about</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="potholes">Potholes & Road Damage</Label>
                    <p className="text-sm text-muted-foreground">Alerts about road surface issues</p>
                  </div>
                  <Switch
                    id="potholes"
                    checked={notificationSettings.potholes}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, potholes: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="traffic-lights">Traffic Light Issues</Label>
                    <p className="text-sm text-muted-foreground">Malfunctioning traffic signals</p>
                  </div>
                  <Switch
                    id="traffic-lights"
                    checked={notificationSettings.trafficLights}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, trafficLights: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="accidents">Accidents & Incidents</Label>
                    <p className="text-sm text-muted-foreground">Traffic accidents and emergency situations</p>
                  </div>
                  <Switch
                    id="accidents"
                    checked={notificationSettings.accidents}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, accidents: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="construction">Construction & Roadwork</Label>
                    <p className="text-sm text-muted-foreground">Planned construction and road closures</p>
                  </div>
                  <Switch
                    id="construction"
                    checked={notificationSettings.construction}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, construction: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="safety">Safety & Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">Crime hotspots and security warnings</p>
                  </div>
                  <Switch
                    id="safety"
                    checked={notificationSettings.safety}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, safety: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="infrastructure">Infrastructure Requests</Label>
                    <p className="text-sm text-muted-foreground">Updates on infrastructure improvement requests</p>
                  </div>
                  <Switch
                    id="infrastructure"
                    checked={notificationSettings.infrastructure}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, infrastructure: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Radius</CardTitle>
                <CardDescription>How far from your routes should we send alerts?</CardDescription>
              </CardHeader>
              <CardContent>
                <Select defaultValue="5km">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1km">1 km radius</SelectItem>
                    <SelectItem value="2km">2 km radius</SelectItem>
                    <SelectItem value="5km">5 km radius (Recommended)</SelectItem>
                    <SelectItem value="10km">10 km radius</SelectItem>
                    <SelectItem value="20km">20 km radius</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button>Save Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
