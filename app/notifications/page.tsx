"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Smartphone,
  Mail,
  Moon,
  Sun,
  RefreshCw,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import PlacesAutocomplete from "@/components/places-autocomplete";
import MapComponent from '@/components/map';
import { supabase } from "@/lib/supabaseClient";
import { useTheme } from "next-themes";
import { NotificationToast } from "@/components/notification-toast";

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "urgent",
    title: "Traffic Light Malfunction",
    message:
      "Traffic light at Main St & 5th Ave is completely out. Use alternate routes.",
    location: "Main St & 5th Ave",
    timestamp: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Large Pothole Reported",
    message:
      "Multiple users reported a large pothole on your frequent route (Oak St).",
    location: "Oak St near Park",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Route Update",
    message:
      "Road construction on Elm St has been completed. Normal traffic flow resumed.",
    location: "Elm St",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "safety",
    title: "Safety Alert",
    message:
      "Increased hijacking reports in Central Ave area. Exercise caution during evening hours.",
    location: "Central Ave",
    timestamp: "1 day ago",
    read: true,
  },
];

interface RouteData {
  id: number;
  name: string;
  from_address: string; // <-- New property name
  to_address: string;   // <-- New property name
  active: boolean;
  polyline?: string; // Polyline to store the route path
}

const mockRoutes: RouteData[] = [
  { id: 1, name: "Home to Work", from_address: "123 Home St, Johannesburg", to_address: "456 Office Ave, Sandton", active: true },
  { id: 2, name: "Home to School", from_address: "123 Home St, Johannesburg", to_address: "789 School Rd, Soweto", active: true },
  { id: 3, name: "Weekend Route", from_address: "123 Home St, Johannesburg", to_address: "Mall Plaza, Randburg", active: false },
];

// Libraries for Google Maps API
const libraries: ("places" | "directions")[] = ['places', 'directions'];

export default function NotificationsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load backend data when component mounts
  useEffect(() => {
    if (mounted) {
      // Load reports data
      fetchReportsFromBackend().then((reportsData) => {
        if (reportsData) {
          const backendNotifications = convertReportsToNotifications(reportsData);
          setNotifications(prev => [...backendNotifications, ...prev]); // Add backend data on top of mock data
        }
      }).catch((error) => {
        console.log('Backend not available for reports - using mock data only');
      });

      // Load routes data
      fetchRoutesFromBackend().then((routesData) => {
        if (routesData) {
          const backendRoutes = convertRoutesToExpectedFormat(routesData);
          setRoutes(prev => [...backendRoutes, ...prev]); // Add backend data on top of mock data
        }
      }).catch((error) => {
        console.log('Backend not available for routes - using mock data only');
      });
    }
  }, [mounted]);

  const [notifications, setNotifications] = useState(mockNotifications);
  const [routes, setRoutes] = useState(mockRoutes);
  const [routeName, setRouteName] = useState("");
  const [origin, setOrigin] = useState<google.maps.places.PlaceResult | null>(null);
  const [destination, setDestination] = useState<google.maps.places.PlaceResult | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [toastNotifications, setToastNotifications] = useState<Array<{
    id: number;
    type: "urgent" | "warning" | "info" | "safety" | "success" | "error";
    title: string;
    message: string;
    location?: string;
  }>>([]);
  
  // Notification helper functions
  const addToastNotification = (type: "urgent" | "warning" | "info" | "safety" | "success" | "error", title: string, message: string, location?: string) => {
    const id = Date.now() + Math.random();
    setToastNotifications(prev => [...prev, { id, type, title, message, location }]);
  };

  const removeToastNotification = (id: number) => {
    setToastNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const [isAdding, setIsAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
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
  });

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };
  // Prevent the dialog from closing when interacting with the Google Autocomplete container
  const handleInteractOutside = (event: Event) => {
    // Check if the click target is inside the Google Autocomplete container
    if ((event.target as HTMLElement).closest('.pac-container')) {
      // If it is, prevent the dialog's default "close on outside click" behavior
      event.preventDefault();
    }
  };

  useEffect(() => {
    const calculateRoute = async () => {
      // Only proceed if both origin and destination have been selected
      if (origin?.geometry?.location && destination?.geometry?.location) {
        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
          origin: origin.geometry.location,
          destination: destination.geometry.location,
          travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
      }
    };

    // If both are selected, calculate the route
    if (origin && destination) {
      calculateRoute();
    } else {
      // If one is cleared, clear the previous route response
      setDirectionsResponse(null);
    }
  }, [origin, destination]); // This effect runs whenever origin or destination changes

  const addRoute = async () => {
    if (!routeName || !origin || !destination || !directionsResponse) {
      addToastNotification("warning", "Route Required", "Please preview a valid route before adding it to your saved routes.");
      return;
    }
    setIsAdding(true);

    // 1. Prepare the data for the backend
    const newRouteData = {
      name: routeName,
      from_address: directionsResponse.routes[0].legs[0].start_address,
      to_address: directionsResponse.routes[0].legs[0].end_address,
      polyline: directionsResponse.routes[0].overview_polyline || "",
    };

    console.log("Sending route data:", newRouteData);

    // 2. Optimistically update the UI
    const tempId = Date.now();
    setRoutes((prevRoutes) => [...prevRoutes, { ...newRouteData, id: tempId, active: true }]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const endpoint = `${apiUrl}/api/routes`;

      // Send the data to the backend without authentication
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRouteData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Backend error response:", errorData);
        throw new Error(`Failed to save the route to the server: ${response.status} ${response.statusText}`);
      }

      // Reset form and close dialog on success
      setRouteName("");
      setOrigin(null);
      setDestination(null);
      setDirectionsResponse(null);
              setDialogOpen(false);
        addToastNotification("success", "Route Added", `Route "${routeName}" has been successfully added to your saved routes.`);
        
        // Refresh routes from backend to show the newly added route
        fetchRoutesFromBackend().then((updatedRoutesData) => {
          if (updatedRoutesData) {
            const backendRoutes = convertRoutesToExpectedFormat(updatedRoutesData);
            setRoutes(prev => {
              // Remove the temporary route and old backend routes, then add fresh backend data
              const withoutTempAndBackend = prev.filter(route => route.id !== tempId && route.id < 10000);
              return [...backendRoutes, ...withoutTempAndBackend];
            });
          }
        }).catch((error) => {
          console.log('Could not refresh routes from backend - keeping local data');
        });

    } catch (error) {
      console.error("Failed to save route:", error);
      
      // Check if the error is an actual Error object
      if (error instanceof Error) {
        addToastNotification("error", "Route Save Failed", `Failed to save your route: ${error.message}`);
      } else {
        addToastNotification("error", "Route Save Failed", "An unknown error occurred while saving your route.");
      }
  
      // Roll back the optimistic update if the API call fails
      setRoutes((prevRoutes) => prevRoutes.filter(route => route.id !== tempId));
    }finally {
      setIsAdding(false);
    }
  };

  // Simple API functions to fetch data from backend (similar to addRoute structure)
  const fetchReportsFromBackend = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const endpoint = `${apiUrl}/api/reports`;

      const response = await fetch(endpoint, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch reports from backend:', error);
      return null;
    }
  };

  const fetchRoutesFromBackend = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const endpoint = `${apiUrl}/api/routes`;

      const response = await fetch(endpoint, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch routes from backend:', error);
      return null;
    }
  };

  // Simple conversion functions to transform backend data to frontend format
  const convertReportsToNotifications = (reportsData: any) => {
    const notifications: any[] = [];
    let notificationId = 1000; // Start with high ID to avoid conflicts with mock data

    // Convert road hazards to notifications
    if (reportsData.road_hazards) {
      reportsData.road_hazards.forEach((hazard: any) => {
        notifications.push({
          id: notificationId++,
          type: hazard.severity === 'urgent' ? 'urgent' : 'warning',
          title: `${hazard.hazard_type} Report`,
          message: hazard.description || `Road hazard reported at ${hazard.location}`,
          location: hazard.location,
          timestamp: new Date(hazard.created_at).toLocaleString(),
          read: false
        });
      });
    }

    // Convert traffic light reports to notifications
    if (reportsData.traffic_light_reports) {
      reportsData.traffic_light_reports.forEach((trafficLight: any) => {
        notifications.push({
          id: notificationId++,
          type: 'urgent',
          title: 'Traffic Light Issue',
          message: `${trafficLight.fault_type} at ${trafficLight.intersection}`,
          location: trafficLight.intersection,
          timestamp: new Date(trafficLight.created_at).toLocaleString(),
          read: false
        });
      });
    }

    return notifications;
  };

  const convertRoutesToExpectedFormat = (routesData: any[]) => {
    return routesData.map((route: any) => ({
      id: route.id + 10000, // Add offset to avoid conflicts with mock data
      name: route.name,
      from_address: route.from_address,
      to_address: route.to_address,
      polyline: route.polyline,
      active: true
    }));
  };

  const toggleRoute = (id: number) => {
    setRoutes(
      routes.map((route) =>
        route.id === id ? { ...route, active: !route.active } : route
      )
    );
  };

  const removeRoute = (id: number) => {
    setRoutes(routes.filter((route) => route.id !== id));
  };

  const handleRefreshNotifications = () => {
    fetchReportsFromBackend().then((reportsData) => {
      if (reportsData) {
        const backendNotifications = convertReportsToNotifications(reportsData);
        setNotifications(prev => {
          // Remove old backend notifications (IDs >= 1000) and add fresh ones
          const withoutBackend = prev.filter(notif => notif.id < 1000);
          return [...backendNotifications, ...withoutBackend];
        });
        addToastNotification("success", "Refreshed", "Notifications have been refreshed from backend.");
      }
    }).catch((error) => {
      addToastNotification("warning", "Refresh Failed", "Could not refresh notifications from backend.");
    });
  };

  const handleRefreshRoutes = () => {
    fetchRoutesFromBackend().then((routesData) => {
      if (routesData) {
        const backendRoutes = convertRoutesToExpectedFormat(routesData);
        setRoutes(prev => {
          // Remove old backend routes (IDs >= 10000) and add fresh ones
          const withoutBackend = prev.filter(route => route.id < 10000);
          return [...backendRoutes, ...withoutBackend];
        });
        addToastNotification("success", "Refreshed", "Routes have been refreshed from backend.");
      }
    }).catch((error) => {
      addToastNotification("warning", "Refresh Failed", "Could not refresh routes from backend.");
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "safety":
        return <Shield className="h-4 w-4 text-secondary" />;
      default:
        return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "safety":
        return <Badge className="bg-purple-100 text-purple-800">Safety</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <style jsx global>{`
        .pac-container {
          z-index: 9999 !important;
        }
      `}</style>
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between container">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />

              <span className="font-bold text-primary">Profile</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button asChild size="sm">
                <Link href="/auth">Sign In</Link>
              </Button>
              {mounted && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Header action button */}
        <div className="container px-4 py-3">
          <Button asChild className="w-full">
            <Link href="/">View more info</Link>
          </Button>
        </div>

        <div className="container max-w-4xl mx-auto py-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Your Profile
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Stay informed about road safety issues on your routes and in your
              area.
            </p>
          </div>

          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger
                value="notifications"
                className="relative text-xs md:text-sm"
              >
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="routes" className="text-xs md:text-sm">
                My Routes
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs md:text-sm">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h2 className="text-lg md:text-xl font-semibold">
                  Recent Notifications
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshNotifications}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    Mark All Read
                  </Button>
                </div>
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
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <h3 className="font-medium text-sm md:text-base">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getNotificationBadge(notification.type)}
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-2">
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
                      You'll receive notifications about safety issues on your
                      routes and in your area.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Routes Tab */}
          <TabsContent value="routes" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold">My Routes</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshRoutes}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={false}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Route
                    </Button>
                  </DialogTrigger>
                <DialogContent onInteractOutside={handleInteractOutside} className="mx-4 overflow-visible">
                  <DialogHeader>
                    <DialogTitle>Add New Route</DialogTitle>
                    <DialogDescription>
                      Add a route to receive notifications about safety issues
                      along your path.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="route-name">Route Name</Label>
                      <Input
                        id="route-name"
                        placeholder="e.g., Home to Work"
                        value={routeName}
                        onChange={(e) => setRouteName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="route-from">From</Label>
                      <PlacesAutocomplete
                        id="route-from"
                        placeholder="Starting address"
                        onPlaceSelect={setOrigin}
                      />
                    </div>
                    <div>
                      <Label htmlFor="route-to">To</Label>
                      <PlacesAutocomplete
                        id="route-to"
                        placeholder="Destination address"
                        onPlaceSelect={setDestination}
                      />
                    </div>

                    {/* The map preview is now always visible */}
                    <div className="h-64 w-full rounded-md overflow-hidden border">
                      <MapComponent
                        // The map will auto-center on the route. These are fallback values.
                        center={{ lat: -26.2041, lng: 28.0473 }} 
                        zoom={10}
                        reports={[]}
                        directionsResponse={directionsResponse}
                      />
                    </div>

                    <Button onClick={addRoute} className="w-full" disabled={isAdding || !directionsResponse}>
                      {isAdding ? "Adding Route..." : "Add Route"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              </div>
            </div>

              <div className="space-y-4">
                {routes.map((route) => (
                  <Card key={route.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Route className="h-4 w-4 text-primary" />
                            <h3 className="font-medium text-sm md:text-base">
                              {route.name}
                            </h3>
                            <Badge
                              variant={route.active ? "default" : "secondary"}
                            >
                              {route.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={route.active}
                              onCheckedChange={() => toggleRoute(route.id)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRoute(route.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">From:</span>
                            {route.from_address}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">To:</span>
                            {route.to_address}
                          </div>
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
                      Add your frequent routes to receive targeted safety
                      notifications.
                    </p>
                    {/* This Dialog now uses the correct, updated form */}
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={false}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Route
                        </Button>
                      </DialogTrigger>
                      <DialogContent onInteractOutside={handleInteractOutside} className="mx-4">
                        <DialogHeader>
                          <DialogTitle>Add New Route</DialogTitle>
                          <DialogDescription>
                            Add a route to receive notifications about safety issues
                            along your path.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="route-name-empty">Route Name</Label>
                            <Input
                              id="route-name-empty"
                              placeholder="e.g., Home to Work"
                              value={routeName}
                              onChange={(e) => setRouteName(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="route-from-empty">From</Label>
                            <PlacesAutocomplete
                              id="route-from-empty"
                              placeholder="Starting address"
                              onPlaceSelect={setOrigin}
                            />
                          </div>
                          <div>
                            <Label htmlFor="route-to-empty">To</Label>
                            <PlacesAutocomplete
                              id="route-to-empty"
                              placeholder="Destination address"
                              onPlaceSelect={setDestination}
                            />
                          </div>

                          {/* The map preview is now always visible */}
                          <div className="h-64 w-full rounded-md overflow-hidden border">
                            <MapComponent
                              // The map will auto-center on the route. These are fallback values.
                              center={{ lat: -26.2041, lng: 28.0473 }} 
                              zoom={10}
                              reports={[]}
                              directionsResponse={directionsResponse}
                            />
                          </div>

                          <Button onClick={addRoute} className="w-full" disabled={isAdding || !directionsResponse}>
                            {isAdding ? "Adding Route..." : "Add Route"}
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
              <h2 className="text-lg md:text-xl font-semibold">Notification Settings</h2>

              {/* Theme toggle moved here */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base md:text-lg">Appearance</CardTitle>
                  <CardDescription className="text-sm">Switch between light, dark, or system theme</CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemeToggle />
                </CardContent>
              </Card>

              

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Settings className="h-5 w-5" />
                    Delivery Methods
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Choose how you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label
                          htmlFor="push-notifications"
                          className="text-sm md:text-base"
                        >
                          Push Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Instant alerts on your device
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          pushNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label
                          htmlFor="email-notifications"
                          className="text-sm md:text-base"
                        >
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Daily summary emails
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label
                          htmlFor="sms-notifications"
                          className="text-sm md:text-base"
                        >
                          SMS Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Text messages for urgent alerts only
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          smsNotifications: checked,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">
                    Alert Types
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Choose which types of safety issues you want to be notified
                    about
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="potholes" className="text-sm md:text-base">
                        Potholes & Road Damage
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Alerts about road surface issues
                      </p>
                    </div>
                    <Switch
                      id="potholes"
                      checked={notificationSettings.potholes}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          potholes: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="traffic-lights"
                        className="text-sm md:text-base"
                      >
                        Traffic Light Issues
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Malfunctioning traffic signals
                      </p>
                    </div>
                    <Switch
                      id="traffic-lights"
                      checked={notificationSettings.trafficLights}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          trafficLights: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="accidents" className="text-sm md:text-base">
                        Accidents & Incidents
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Traffic accidents and emergency situations
                      </p>
                    </div>
                    <Switch
                      id="accidents"
                      checked={notificationSettings.accidents}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          accidents: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="construction"
                        className="text-sm md:text-base"
                      >
                        Construction & Roadwork
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Planned construction and road closures
                      </p>
                    </div>
                    <Switch
                      id="construction"
                      checked={notificationSettings.construction}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          construction: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="safety" className="text-sm md:text-base">
                        Safety & Security Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Crime hotspots and security warnings
                      </p>
                    </div>
                    <Switch
                      id="safety"
                      checked={notificationSettings.safety}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          safety: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="infrastructure"
                        className="text-sm md:text-base"
                      >
                        Infrastructure Requests
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Updates on infrastructure improvement requests
                      </p>
                    </div>
                    <Switch
                      id="infrastructure"
                      checked={notificationSettings.infrastructure}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          infrastructure: checked,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">
                    Notification Radius
                  </CardTitle>
                  <CardDescription className="text-sm">
                    How far from your routes should we send alerts?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select defaultValue="5km">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1km">1 km radius</SelectItem>
                      <SelectItem value="2km">2 km radius</SelectItem>
                      <SelectItem value="5km">
                        5 km radius (Recommended)
                      </SelectItem>
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

      {/* Toast Notifications */}
      {toastNotifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onDismiss={removeToastNotification}
        />
      ))}
    </>
  ); 
}

