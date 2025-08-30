export interface User {
  id: string
  email: string
  password: string
  name: string
  phone: string
  city: string
  role: "user" | "admin"
  createdAt: string
}

export interface Report {
  id: string
  userId: string
  type: "pothole" | "obstruction" | "traffic_light" | "infrastructure" | "emergency"
  title: string
  description: string
  location: {
    lat: number
    lng: number
    address: string
  }
  severity: "low" | "medium" | "high" | "critical"
  status: "pending" | "in_progress" | "resolved" | "rejected"
  photos: string[]
  upvotes: number
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: "safety_alert" | "report_update" | "route_hazard"
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface NotificationSettings {
  userId: string
  routes: Array<{
    name: string
    coordinates: Array<{ lat: number; lng: number }>
    radius: number
  }>
  alertTypes: string[]
  deliveryMethods: string[]
  enabled: boolean
}

export interface Route {
  id: string
  userId: string
  name: string
  from: string
  to: string
  active: boolean
  createdAt: string
}
