"use client"

import type React from "react"

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
import { AlertTriangle, Camera, MapPin, Navigation, Shield, Users, Upload, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function ReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [currentLocation, setCurrentLocation] = useState<string>("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [hazardForm, setHazardForm] = useState({
    type: "",
    severity: "medium",
    location: "",
    description: "",
  })

  const [infraForm, setInfraForm] = useState({
    type: "",
    priority: "",
    location: "",
    justification: "",
  })

  const [trafficForm, setTrafficForm] = useState({
    faultType: "",
    affectedLanes: "",
    intersection: "",
    trafficImpact: "",
  })

  const [emergencyForm, setEmergencyForm] = useState({
    type: "",
    location: "",
    situation: "",
    contact: "",
  })

  const { user, token } = useAuth()
  const router = useRouter()

  if (!user || !token) {
    router.push("/auth")
    return null
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files))
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude}, ${position.coords.longitude}`
          setCurrentLocation(location)
          // Update current form location
          setHazardForm((prev) => ({ ...prev, location }))
          setInfraForm((prev) => ({ ...prev, location }))
          setTrafficForm((prev) => ({ ...prev, intersection: location }))
          setEmergencyForm((prev) => ({ ...prev, location }))
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const submitReport = async (reportData: any, reportType: string) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...reportData,
          reportType,
          photos: selectedImages.map((file) => file.name), // In real app, would upload files first
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit report")
      }

      const result = await response.json()
      console.log("[v0] Report submitted successfully:", result)

      setSubmitSuccess(true)
      // Reset forms
      setHazardForm({ type: "", severity: "medium", location: "", description: "" })
      setInfraForm({ type: "", priority: "", location: "", justification: "" })
      setTrafficForm({ faultType: "", affectedLanes: "", intersection: "", trafficImpact: "" })
      setEmergencyForm({ type: "", location: "", situation: "", contact: "" })
      setSelectedImages([])

      // Redirect to map after 2 seconds
      setTimeout(() => {
        router.push("/map")
      }, 2000)
    } catch (error) {
      console.error("[v0] Report submission error:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to submit report")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHazardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitReport(hazardForm, "hazard")
  }

  const handleInfraSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitReport(infraForm, "infrastructure")
  }

  const handleTrafficSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitReport(trafficForm, "traffic-light")
  }

  const handleEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitReport(emergencyForm, "emergency")
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-bold mb-2">Report Submitted!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for helping make our roads safer. Your report has been sent to the relevant authorities.
            </p>
            <p className="text-sm text-muted-foreground">Redirecting to safety map...</p>
          </CardContent>
        </Card>
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
            <Link href="/map" className="text-sm font-medium hover:text-primary transition-colors">
              Safety Map
            </Link>
            <Link href="/education" className="text-sm font-medium hover:text-primary transition-colors">
              Safety Hub
            </Link>
          </nav>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Report a Safety Issue</h1>
          <p className="text-muted-foreground">
            Help make our roads safer by reporting hazards, requesting improvements, or alerting the community about
            issues.
          </p>
        </div>

        {submitError && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Error: {submitError}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="hazard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="hazard">Road Hazard</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="traffic-light">Traffic Light</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>

          {/* Road Hazard Report */}
          <TabsContent value="hazard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-secondary" />
                  Report Road Hazard
                </CardTitle>
                <CardDescription>
                  Report potholes, obstructions, debris, or other road hazards that pose a safety risk.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHazardSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hazard-type">Hazard Type</Label>
                      <Select
                        value={hazardForm.type}
                        onValueChange={(value) => setHazardForm((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select hazard type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pothole">Pothole</SelectItem>
                          <SelectItem value="obstruction">Road Obstruction</SelectItem>
                          <SelectItem value="debris">Debris on Road</SelectItem>
                          <SelectItem value="accident">Accident Scene</SelectItem>
                          <SelectItem value="flooding">Road Flooding</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Severity Level</Label>
                      <RadioGroup
                        value={hazardForm.severity}
                        onValueChange={(value) => setHazardForm((prev) => ({ ...prev, severity: value }))}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="minor" id="minor" />
                          <Label htmlFor="minor" className="flex items-center gap-1">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Minor
                            </Badge>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium" className="flex items-center gap-1">
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Medium
                            </Badge>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="urgent" id="urgent" />
                          <Label htmlFor="urgent" className="flex items-center gap-1">
                            <Badge variant="destructive">Urgent</Badge>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex gap-2">
                      <Input
                        id="location"
                        placeholder="Enter street address or intersection"
                        value={hazardForm.location}
                        onChange={(e) => setHazardForm((prev) => ({ ...prev, location: e.target.value }))}
                        className="flex-1"
                        required
                      />
                      <Button type="button" variant="outline" onClick={getCurrentLocation}>
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the hazard in detail..."
                      className="min-h-[100px]"
                      value={hazardForm.description}
                      onChange={(e) => setHazardForm((prev) => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photos">Photos (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
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
                        <p className="text-sm text-muted-foreground">Click to upload photos or drag and drop</p>
                      </Label>
                      {selectedImages.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium">{selectedImages.length} file(s) selected</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !hazardForm.type || !hazardForm.location}
                  >
                    {isSubmitting ? "Submitting Report..." : "Submit Hazard Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Infrastructure Request */}
          <TabsContent value="infrastructure">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-secondary" />
                  Request Infrastructure Change
                </CardTitle>
                <CardDescription>
                  Request new traffic lights, road improvements, or other infrastructure changes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInfraSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="request-type">Request Type</Label>
                      <Select
                        value={infraForm.type}
                        onValueChange={(value) => setInfraForm((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="traffic-light">New Traffic Light</SelectItem>
                          <SelectItem value="turning-arrow">Add Turning Arrow</SelectItem>
                          <SelectItem value="stop-sign">New Stop Sign</SelectItem>
                          <SelectItem value="speed-bump">Speed Bump</SelectItem>
                          <SelectItem value="pedestrian-crossing">Pedestrian Crossing</SelectItem>
                          <SelectItem value="road-marking">Road Marking</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={infraForm.priority}
                        onValueChange={(value) => setInfraForm((prev) => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="infra-location">Location</Label>
                    <div className="flex gap-2">
                      <Input
                        id="infra-location"
                        placeholder="Enter intersection or street address"
                        className="flex-1"
                        value={infraForm.location}
                        onChange={(e) => setInfraForm((prev) => ({ ...prev, location: e.target.value }))}
                        required
                      />
                      <Button type="button" variant="outline" onClick={getCurrentLocation}>
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="justification">Justification</Label>
                    <Textarea
                      id="justification"
                      placeholder="Explain why this infrastructure change is needed..."
                      className="min-h-[120px]"
                      value={infraForm.justification}
                      onChange={(e) => setInfraForm((prev) => ({ ...prev, justification: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="infra-photos">Supporting Photos (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="infra-photos"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Label htmlFor="infra-photos" className="cursor-pointer">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload photos of the current situation</p>
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !infraForm.type || !infraForm.location}
                  >
                    {isSubmitting ? "Submitting Request..." : "Submit Infrastructure Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traffic Light Report */}
          <TabsContent value="traffic-light">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Report Faulty Traffic Light
                </CardTitle>
                <CardDescription>
                  Report traffic lights that are not working properly or are completely out of order.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTrafficSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fault-type">Fault Type</Label>
                      <Select
                        value={trafficForm.faultType}
                        onValueChange={(value) => setTrafficForm((prev) => ({ ...prev, faultType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select fault type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completely-off">Completely Off</SelectItem>
                          <SelectItem value="one-direction">One Direction Not Working</SelectItem>
                          <SelectItem value="stuck-red">Stuck on Red</SelectItem>
                          <SelectItem value="stuck-green">Stuck on Green</SelectItem>
                          <SelectItem value="flashing">Flashing/Intermittent</SelectItem>
                          <SelectItem value="timing-issue">Timing Issues</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="affected-lanes">Affected Lanes</Label>
                      <Select
                        value={trafficForm.affectedLanes}
                        onValueChange={(value) => setTrafficForm((prev) => ({ ...prev, affectedLanes: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select affected lanes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Directions</SelectItem>
                          <SelectItem value="north-south">North-South</SelectItem>
                          <SelectItem value="east-west">East-West</SelectItem>
                          <SelectItem value="single-lane">Single Lane</SelectItem>
                          <SelectItem value="turning-lane">Turning Lane Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intersection">Intersection</Label>
                    <Input
                      id="intersection"
                      placeholder="e.g., Main St & Oak Ave"
                      value={trafficForm.intersection}
                      onChange={(e) => setTrafficForm((prev) => ({ ...prev, intersection: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="traffic-impact">Traffic Impact</Label>
                    <Textarea
                      id="traffic-impact"
                      placeholder="Describe how this is affecting traffic flow..."
                      className="min-h-[80px]"
                      value={trafficForm.trafficImpact}
                      onChange={(e) => setTrafficForm((prev) => ({ ...prev, trafficImpact: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="font-medium text-destructive">Urgent Alert</span>
                    </div>
                    <p className="text-sm text-destructive/80">
                      This report will be immediately escalated to municipal authorities and emergency services.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-destructive hover:bg-destructive/90"
                    disabled={isSubmitting || !trafficForm.faultType || !trafficForm.intersection}
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-secondary" />
                  Request Traffic Director
                </CardTitle>
                <CardDescription>
                  Request a traffic director for major intersections with faulty lights or emergency situations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmergencySubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="emergency-type">Request Type</Label>
                    <Select
                      value={emergencyForm.type}
                      onValueChange={(value) => setEmergencyForm((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traffic-director">Traffic Director</SelectItem>
                        <SelectItem value="emergency-response">Emergency Response</SelectItem>
                        <SelectItem value="accident-management">Accident Management</SelectItem>
                        <SelectItem value="event-support">Event Traffic Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency-location">Location</Label>
                    <Input
                      id="emergency-location"
                      placeholder="Exact intersection or address"
                      value={emergencyForm.location}
                      onChange={(e) => setEmergencyForm((prev) => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="situation">Situation Description</Label>
                    <Textarea
                      id="situation"
                      placeholder="Describe the current situation and why assistance is needed..."
                      className="min-h-[100px]"
                      value={emergencyForm.situation}
                      onChange={(e) => setEmergencyForm((prev) => ({ ...prev, situation: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Your Contact Number</Label>
                    <Input
                      id="contact"
                      type="tel"
                      placeholder="+27 XX XXX XXXX"
                      value={emergencyForm.contact}
                      onChange={(e) => setEmergencyForm((prev) => ({ ...prev, contact: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span className="font-medium text-secondary">Priority Request</span>
                    </div>
                    <p className="text-sm text-secondary/80">
                      Emergency requests are sent directly to municipal authorities and insurance partners for immediate
                      response.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !emergencyForm.type || !emergencyForm.location}
                  >
                    {isSubmitting ? "Sending Request..." : "Send Emergency Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
