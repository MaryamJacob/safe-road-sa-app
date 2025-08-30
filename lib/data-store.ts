import fs from "fs"
import path from "path"
import type { User, Report, Notification, NotificationSettings, Route } from "./types"

const DATA_DIR = path.join(process.cwd(), "data")

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

class DataStore {
  private getFilePath(collection: string): string {
    return path.join(DATA_DIR, `${collection}.json`)
  }

  private readCollection<T>(collection: string): T[] {
    try {
      const filePath = this.getFilePath(collection)
      if (!fs.existsSync(filePath)) {
        return []
      }
      const data = fs.readFileSync(filePath, "utf-8")
      return JSON.parse(data)
    } catch (error) {
      console.error(`Error reading ${collection}:`, error)
      return []
    }
  }

  private writeCollection<T>(collection: string, data: T[]): void {
    try {
      const filePath = this.getFilePath(collection)
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    } catch (error) {
      console.error(`Error writing ${collection}:`, error)
    }
  }

  // Users
  getUsers(): User[] {
    return this.readCollection<User>("users")
  }

  addUser(user: User): void {
    const users = this.getUsers()
    users.push(user)
    this.writeCollection("users", users)
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((user) => user.email === email)
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find((user) => user.id === id)
  }

  // Reports
  getReports(): Report[] {
    return this.readCollection<Report>("reports")
  }

  addReport(report: Report): void {
    const reports = this.getReports()
    reports.push(report)
    this.writeCollection("reports", reports)
  }

  updateReport(id: string, updates: Partial<Report>): void {
    const reports = this.getReports()
    const index = reports.findIndex((report) => report.id === id)
    if (index !== -1) {
      reports[index] = { ...reports[index], ...updates, updatedAt: new Date().toISOString() }
      this.writeCollection("reports", reports)
    }
  }

  // Notifications
  getNotifications(): Notification[] {
    return this.readCollection<Notification>("notifications")
  }

  addNotification(notification: Notification): void {
    const notifications = this.getNotifications()
    notifications.push(notification)
    this.writeCollection("notifications", notifications)
  }

  getUserNotifications(userId: string): Notification[] {
    return this.getNotifications().filter((notification) => notification.userId === userId)
  }

  // Notification Settings
  getNotificationSettings(): NotificationSettings[] {
    return this.readCollection<NotificationSettings>("notification-settings")
  }

  updateNotificationSettings(settings: NotificationSettings): void {
    const allSettings = this.getNotificationSettings()
    const index = allSettings.findIndex((s) => s.userId === settings.userId)
    if (index !== -1) {
      allSettings[index] = settings
    } else {
      allSettings.push(settings)
    }
    this.writeCollection("notification-settings", allSettings)
  }

  // Routes
  getRoutes(): Route[] {
    return this.readCollection<Route>("routes")
  }

  addRoute(route: Route): void {
    const routes = this.getRoutes()
    routes.push(route)
    this.writeCollection("routes", routes)
  }

  getUserRoutes(userId: string): Route[] {
    return this.getRoutes().filter((route) => route.userId === userId)
  }

  updateRoute(id: string, updates: Partial<Route>): void {
    const routes = this.getRoutes()
    const index = routes.findIndex((route) => route.id === id)
    if (index !== -1) {
      routes[index] = { ...routes[index], ...updates }
      this.writeCollection("routes", routes)
    }
  }

  deleteRoute(id: string): void {
    const routes = this.getRoutes()
    const filteredRoutes = routes.filter((route) => route.id !== id)
    this.writeCollection("routes", filteredRoutes)
  }

  // Unified data access method for backward compatibility
  getData() {
    return {
      users: this.getUsers(),
      reports: this.getReports(),
      notifications: this.getNotifications(),
      routes: this.getRoutes(),
      notificationSettings: this.getNotificationSettings(),
    }
  }

  saveData(data: any) {
    if (data.users) this.writeCollection("users", data.users)
    if (data.reports) this.writeCollection("reports", data.reports)
    if (data.notifications) this.writeCollection("notifications", data.notifications)
    if (data.routes) this.writeCollection("routes", data.routes)
    if (data.notificationSettings) this.writeCollection("notification-settings", data.notificationSettings)
  }
}

export const dataStore = new DataStore()
