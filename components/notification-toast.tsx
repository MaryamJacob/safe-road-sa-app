"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X, MapPin, Bell } from "lucide-react"

interface NotificationToastProps {
  notification: {
    id: number
    type: "urgent" | "warning" | "info" | "safety"
    title: string
    message: string
    location?: string
  }
  onDismiss: (id: number) => void
  autoHide?: boolean
  duration?: number
}

export function NotificationToast({
  notification,
  onDismiss,
  autoHide = true,
  duration = 5000,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onDismiss(notification.id), 300)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoHide, duration, notification.id, onDismiss])

  const getIcon = () => {
    switch (notification.type) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "safety":
        return <AlertTriangle className="h-4 w-4 text-secondary" />
      default:
        return <Bell className="h-4 w-4 text-blue-600" />
    }
  }

  const getBadge = () => {
    switch (notification.type) {
      case "urgent":
        return (
          <Badge variant="destructive" className="text-xs">
            Urgent
          </Badge>
        )
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Warning</Badge>
      case "safety":
        return <Badge className="bg-purple-100 text-purple-800 text-xs">Safety</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Info</Badge>
    }
  }

  if (!isVisible) return null

  return (
    <Card
      className={`fixed top-20 right-4 w-80 z-50 shadow-lg transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${
        notification.type === "urgent"
          ? "border-destructive"
          : notification.type === "warning"
            ? "border-yellow-500"
            : notification.type === "safety"
              ? "border-purple-500"
              : "border-blue-500"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getIcon()}
            <h4 className="font-medium text-sm">{notification.title}</h4>
          </div>
          <div className="flex items-center gap-2">
            {getBadge()}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onDismiss(notification.id), 300)
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
        {notification.location && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {notification.location}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
