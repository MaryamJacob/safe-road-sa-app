// safe-road-sa-app/app/report/page.tsx

"use client"

import type React from "react";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Camera, MapPin, Navigation, Shield, Users, Upload, CheckCircle } from "lucide-react"
import { fetchCurrentLocation } from "@/components/current-location" // Current Location
import LocationPickerMap from "@/components/location-picker-map"; // Location Picker Map
import { useMapStore, Report } from '@/lib/store'; // Store and Report type
import { useRouter } from 'next/navigation'; // Router

export default function ReportPage() {
  const router = useRouter();
  const { addReport } = useMapStore(); // Get the addReport action
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [currentLocation, setCurrentLocation] = useState<string>("")
  const [isFetchingLocation, setIsFetchingLocation] = useState(false) // Current Location Fetching State
  const [isMapOpen, setIsMapOpen] = useState(false)

  // Form state variables for all tabs
  // Hazard form
  const [hazardType, setHazardType] = useState<string>("")
  const [severity, setSeverity] = useState<string>("medium")
  const [description, setDescription] = useState<string>("")
  
  // Infrastructure form
  const [requestType, setRequestType] = useState<string>("")
  const [priority, setPriority] = useState<string>("")
  const [infraLocation, setInfraLocation] = useState<string>("")
  const [justification, setJustification] = useState<string>("")
  
  // Traffic Light form
  const [faultType, setFaultType] = useState<string>("")
  const [affectedLanes, setAffectedLanes] = useState<string>("")
  const [intersection, setIntersection] = useState<string>("")
  const [trafficImpact, setTrafficImpact] = useState<string>("")
  
  // Emergency form
  const [emergencyType, setEmergencyType] = useState<string>("")
  const [emergencyLocation, setEmergencyLocation] = useState<string>("")
  const [situation, setSituation] = useState<string>("")
  const [contact, setContact] = useState<string>("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  // Get Current Location
  const getCurrentLocation = async () => {
    setIsFetchingLocation(true)
    try {
      const coords = await fetchCurrentLocation()
      // Format the coordinates to fit the existing string state
      setCurrentLocation(`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`)
    } catch (error: any) {
      console.error("Error getting location:", error.message)
      // Optional: Show an alert or a toast message to the user
      alert(`Could not get location: ${error.message}`)
    } finally {
      setIsFetchingLocation(false)
    }
  };

  // Handle Location Select
  const handleLocationSelect = (coords: { lat: number, lng: number }) => {
    setCurrentLocation(`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
    setIsMapOpen(false); // Close the dialog
  }

  // Generic submission function from temp-page.tsx
  const submitReport = async (type: string, payload: Record<string, any>, withPhotos = false) => {
    setIsSubmitting(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001'
      const endpoint = `${apiUrl}/api/reports/${type}`
      
      console.log("API URL:", apiUrl)
      console.log("Endpoint:", endpoint)
      
      let res
      if (withPhotos) {
        const formData = new FormData()
        Object.entries(payload).forEach(([key, value]) => {
          formData.append(key, value as string)
        })
        selectedImages.forEach((file) => {
          formData.append("photos", file)
        })
        console.log("Sending FormData with photos")
        res = await fetch(endpoint, {
          method: "POST",
          body: formData,
        })
      } else {
        console.log("Sending JSON payload:", JSON.stringify(payload))
        res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) {
        const errorData = await res.text()
        console.error(`HTTP ${res.status}: ${res.statusText}`)
        console.error("Error response:", errorData)
        throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorData}`)
      }

      const data = await res.json()
      console.log("✅ Report submitted:", data)
      alert("Report submitted successfully!")
    } catch (err) {
      console.error("Submission error:", err)
      alert(`Failed to submit report: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
      setSelectedImages([])
    }
  }

  // Hazard form submission handler
  const handleHazardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!currentLocation) {
      alert("Please set a location for the report.");
      return;
    }
    if (!hazardType) {
      alert("Please select a hazard type.");
      return;
    }
    if (!description.trim()) {
      alert("Please provide a description.");
      return;
    }

    // Try the exact structure from temp-page.tsx
    const payload = {
      hazard_type: hazardType,
      severity: severity,
      location: currentLocation,
      description: description,
    };

    console.log("Submitting hazard report with payload:", payload);
    console.log("Selected images:", selectedImages.length);

    try {
      // Call the generic submission function
      await submitReport('hazard', payload, selectedImages.length > 0);
      
      // Only redirect if submission was successful
      router.push('/');
    } catch (error) {
      console.error("Hazard submission failed:", error);
      // Don't redirect on error - let the submitReport function handle the error display
    }
  };

  // Infrastructure form submission handler
  const handleInfrastructureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!infraLocation) {
      alert("Please set a location for the request.");
      return;
    }

    const payload = {
      request_type: requestType,
      priority: priority,
      location: infraLocation,
      justification: justification,
    };

    await submitReport('infrastructure', payload, selectedImages.length > 0);
    router.push('/');
  };

  // Traffic Light form submission handler
  const handleTrafficLightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intersection) {
      alert("Please specify the intersection.");
      return;
    }

    const payload = {
      fault_type: faultType,
      affected_lanes: affectedLanes,
      intersection: intersection,
      traffic_impact: trafficImpact,
    };

    await submitReport('traffic-light', payload);
    router.push('/');
  };

  // Emergency form submission handler
  const handleEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergencyLocation) {
      alert("Please set a location for the emergency request.");
      return;
    }

    const payload = {
      request_type: emergencyType,
      location: emergencyLocation,
      description: situation,
      contact_number: contact,
    };

    await submitReport('emergency', payload);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary">Report Issue</span>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Report a Safety Issue
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Help make our roads safer by reporting hazards, requesting
            improvements, or alerting the community about issues.
          </p>
        </div>

        <Tabs defaultValue="hazard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
            <TabsTrigger value="hazard" className="text-xs md:text-sm">
              Road Hazard
            </TabsTrigger>
            <TabsTrigger value="infrastructure" className="text-xs md:text-sm">
              Infrastructure
            </TabsTrigger>
            <TabsTrigger value="traffic-light" className="text-xs md:text-sm">
              Traffic Light
            </TabsTrigger>
            <TabsTrigger value="emergency" className="text-xs md:text-sm">
              Emergency
            </TabsTrigger>
          </TabsList>

          {/* Road Hazard Report */}
          <TabsContent value="hazard">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <AlertTriangle className="h-5 w-5 text-secondary" />
                  Report Road Hazard
                </CardTitle>
                <CardDescription className="text-sm">
                  Report potholes, obstructions, debris, or other road hazards
                  that pose a safety risk.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHazardSubmit} className="space-y-4 md:space-y-6">
                  <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hazard-type">Hazard Type</Label>
                      <Select value={hazardType} onValueChange={setHazardType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hazard type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pothole">Pothole</SelectItem>
                          <SelectItem value="road obstruction">Road Obstruction</SelectItem>
                          <SelectItem value="debris on road">Debris on Road</SelectItem>
                          <SelectItem value="accident scene">Accident Scene</SelectItem>
                          <SelectItem value="road flooding">Road Flooding</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Severity Level</Label>
                      <RadioGroup value={severity} onValueChange={setSeverity} className="flex flex-col md:flex-row gap-3 md:gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="minor" id="minor" />
                          <Label
                            htmlFor="minor"
                            className="flex items-center gap-1"
                          >
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                            >
                              Minor
                            </Badge>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label
                            htmlFor="medium"
                            className="flex items-center gap-1"
                          >
                            <Badge
                              variant="secondary"
                              className="bg-yellow-100 text-yellow-800"
                            >
                              Medium
                            </Badge>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="urgent" id="urgent" />
                          <Label
                            htmlFor="urgent"
                            className="flex items-center gap-1"
                          >
                            <Badge variant="destructive">Urgent</Badge>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Input
                        id="location"
                        placeholder="Enter street address or intersection"
                        value={currentLocation}
                        onChange={(e) => setCurrentLocation(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" className="md:w-auto" onClick={() => setIsMapOpen(true)}>
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Pin on Map</span>
                      </Button>
                      <Button type="button" variant="outline" onClick={getCurrentLocation} className="md:w-auto" disabled={isFetchingLocation}>
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="md:hidden">{isFetchingLocation ? "Fetching..." : "Get Location"}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the hazard in detail..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photos">Photos (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 md:p-6 text-center">
                      <input
                        type="file"
                        id="photos"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Label htmlFor="photos" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload photos or drag and drop
                        </p>
                      </Label>
                      {selectedImages.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium">
                            {selectedImages.length} file(s) selected
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Submitting Report..."
                      : "Submit Hazard Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Infrastructure Request */}
          <TabsContent value="infrastructure">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Navigation className="h-5 w-5 text-secondary" />
                  Request Infrastructure Change
                </CardTitle>
                <CardDescription className="text-sm">
                  Request new traffic lights, road improvements, or other
                  infrastructure changes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInfrastructureSubmit} className="space-y-4 md:space-y-6">
                  <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="request-type">Request Type</Label>
                      <Select value={requestType} onValueChange={setRequestType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new traffic light">New Traffic Light</SelectItem>
                          <SelectItem value="add turning arrow">Add Turning Arrow</SelectItem>
                          <SelectItem value="new stop sign">New Stop Sign</SelectItem>
                          <SelectItem value="speed bump">Speed Bump</SelectItem>
                          <SelectItem value="pedestrian crossing">Pedestrian Crossing</SelectItem>
                          <SelectItem value="road marking">Road Marking</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low priority">Low Priority</SelectItem>
                          <SelectItem value="medium priority">Medium Priority</SelectItem>
                          <SelectItem value="high priority">High Priority</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="infra-location">Location</Label>
                    <div className="flex flex-col md:flex-row gap-3">
                      <Input
                        id="infra-location"
                        value={infraLocation}
                        onChange={(e) => setInfraLocation(e.target.value)}
                        placeholder="Enter intersection or street address"
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" className="md:w-auto" onClick={() => setIsMapOpen(true)}>
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Pin on Map</span>
                      </Button>
                      <Button type="button" variant="outline" onClick={getCurrentLocation} className="md:w-auto">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="md:hidden">Get Location</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="justification">Justification</Label>
                    <Textarea
                      id="justification"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="Explain why this infrastructure change is needed..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="infra-photos">
                      Supporting Photos (Optional)
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 md:p-6 text-center">
                      <input
                        type="file"
                        id="infra-photos"
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <Label htmlFor="infra-photos" className="cursor-pointer">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Upload photos of the current situation
                        </p>
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Submitting Request..."
                      : "Submit Infrastructure Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traffic Light Report */}
          <TabsContent value="traffic-light">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Report Faulty Traffic Light
                </CardTitle>
                <CardDescription className="text-sm">
                  Report traffic lights that are not working properly or are
                  completely out of order.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTrafficLightSubmit} className="space-y-4 md:space-y-6">
                  <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fault-type">Fault Type</Label>
                      <Select value={faultType} onValueChange={setFaultType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fault type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completely off">Completely Off</SelectItem>
                          <SelectItem value="one direction not working">One Direction Not Working</SelectItem>
                          <SelectItem value="stuck on red">Stuck on Red</SelectItem>
                          <SelectItem value="stuck on green">Stuck on Green</SelectItem>
                          <SelectItem value="flashing">Flashing/Intermittent</SelectItem>
                          <SelectItem value="timing issues">Timing Issues</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="affected-lanes">Affected Lanes</Label>
                      <Select value={affectedLanes} onValueChange={setAffectedLanes}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select affected lanes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all directions">All Directions</SelectItem>
                          <SelectItem value="north-south">North-South</SelectItem>
                          <SelectItem value="east-west">East-West</SelectItem>
                          <SelectItem value="single lane">Single Lane</SelectItem>
                          <SelectItem value="turning lane only">Turning Lane Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intersection">Intersection</Label>
                    <Input 
                      id="intersection" 
                      value={intersection}
                      onChange={(e) => setIntersection(e.target.value)}
                      placeholder="e.g., Main St & Oak Ave" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="traffic-impact">Traffic Impact</Label>
                    <Textarea
                      id="traffic-impact"
                      value={trafficImpact}
                      onChange={(e) => setTrafficImpact(e.target.value)}
                      placeholder="Describe how this is affecting traffic flow..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="font-medium text-destructive">
                        Urgent Alert
                      </span>
                    </div>
                    <p className="text-sm text-destructive/80">
                      This report will be immediately escalated to municipal
                      authorities and emergency services.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-destructive hover:bg-destructive/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending Alert..." : "Send Urgent Alert"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Request */}
          <TabsContent value="emergency">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Users className="h-5 w-5 text-secondary" />
                  Request Traffic Director
                </CardTitle>
                <CardDescription className="text-sm">
                  Request a traffic director for major intersections with faulty
                  lights or emergency situations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmergencySubmit} className="space-y-4 md:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="emergency-type">Request Type</Label>
                    <Select value={emergencyType} onValueChange={setEmergencyType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traffic director">Traffic Director</SelectItem>
                        <SelectItem value="emergency response">Emergency Response</SelectItem>
                        <SelectItem value="accident management">Accident Management</SelectItem>
                        <SelectItem value="event traffic support">Event Traffic Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency-location">Location</Label>
                    <Input 
                      id="emergency-location" 
                      value={emergencyLocation}
                      onChange={(e) => setEmergencyLocation(e.target.value)}
                      placeholder="Exact intersection or address" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="situation">Situation Description</Label>
                    <Textarea
                      id="situation"
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      placeholder="Describe the current situation and why assistance is needed..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Your Contact Number</Label>
                    <Input 
                      id="contact" 
                      type="tel" 
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="+27 XX XXX XXXX" 
                    />
                  </div>

                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span className="font-medium text-secondary">
                        Priority Request
                      </span>
                    </div>
                    <p className="text-sm text-secondary/80">
                      Emergency requests are sent directly to municipal
                      authorities and insurance partners for immediate response.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Sending Request..."
                      : "Send Emergency Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Emergency Request */}
        <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Pin the Exact Location</DialogTitle>
          </DialogHeader>
          <LocationPickerMap 
            onLocationSelect={handleLocationSelect} 
            onClose={() => setIsMapOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      </div>
    </div>
  );
}
