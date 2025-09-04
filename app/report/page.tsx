// report/page.tsx Functions

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
import { AlertTriangle, Camera, MapPin, Navigation, Shield, Users, Upload, CheckCircle } from "lucide-react"

export default function ReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [currentLocation, setCurrentLocation] = useState<string>("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files))
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(`${position.coords.latitude}, ${position.coords.longitude}`)
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const submitReport = async (type: string, payload: Record<string, any>, withPhotos = false) => {
    setIsSubmitting(true)
    try {
      let res
      if (withPhotos) {
        const formData = new FormData()
        Object.entries(payload).forEach(([key, value]) => {
          formData.append(key, value as string)
        })
        selectedImages.forEach((file) => {
          formData.append("photos", file)
        })
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${type}`, {
          method: "POST",
          body: formData,
        })
      } else {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${type}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      const data = await res.json()
      console.log("✅ Report submitted:", data)
      alert("Report submitted successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to submit report.")
    } finally {
      setIsSubmitting(false)
      setSelectedImages([])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center px-4">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-primary">Report Issue</span>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Report a Safety Issue</h1>
        <p className="text-muted-foreground mb-6">
          Help make our roads safer by reporting hazards, requesting improvements, or alerting the community about
          issues.
        </p>

        <Tabs defaultValue="hazard" className="w-full">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-6">
            <TabsTrigger value="hazard">Road Hazard</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="traffic-light">Traffic Light</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>

          {/* Hazard */}
          <TabsContent value="hazard">
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 text-secondary" /> Report Road Hazard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const payload = {
                      hazard_type: (e.currentTarget as any)["hazard-type"].value,
                      severity: (e.currentTarget as any)["severity"].value,
                      location: (e.currentTarget as any)["location"].value,
                      description: (e.currentTarget as any)["description"].value,
                    }
                    submitReport("hazard", payload, true)
                  }}
                  className="space-y-4"
                >
                  <Label>Hazard Type</Label>
                  <Select name="hazard-type" required>
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

                  <Label>Severity</Label>
                  <RadioGroup name="severity" defaultValue="medium" className="flex gap-4">
                    <div><RadioGroupItem value="minor" id="minor" /><Label htmlFor="minor">Minor</Label></div>
                    <div><RadioGroupItem value="medium" id="medium" /><Label htmlFor="medium">Medium</Label></div>
                    <div><RadioGroupItem value="urgent" id="urgent" /><Label htmlFor="urgent">Urgent</Label></div>
                  </RadioGroup>

                  <Label>Location</Label>
                  <Input id="location" name="location" value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)} />

                  <Label>Description</Label>
                  <Textarea id="description" name="description" />

                  <Label>Photos</Label>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Hazard"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Infrastructure */}
          <TabsContent value="infrastructure">
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2">
                  <Navigation className="h-5 w-5 text-secondary" /> Infrastructure Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const payload = {
                      request_type: (e.currentTarget as any)["request-type"].value,
                      priority: (e.currentTarget as any)["priority"].value,
                      location: (e.currentTarget as any)["infra-location"].value,
                      justification: (e.currentTarget as any)["justification"].value,
                    }
                    submitReport("infrastructure", payload, true)
                  }}
                  className="space-y-4"
                >
                  <Label>Request Type</Label>
                  <Select name="request-type" required>
                    <SelectTrigger><SelectValue placeholder="Select request" /></SelectTrigger>
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

                  <Label>Priority</Label>
                  <Select name="priority" required>
                    <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low priority">Low</SelectItem>
                      <SelectItem value="medium priority">Medium</SelectItem>
                      <SelectItem value="high priority">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>

                  <Label>Location</Label>
                  <Input name="infra-location" />

                  <Label>Justification</Label>
                  <Textarea name="justification" />

                  <Label>Photos</Label>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traffic Light */}
          <TabsContent value="traffic-light">
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" /> Traffic Light Fault
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const payload = {
                      fault_type: (e.currentTarget as any)["fault-type"].value,
                      affected_lanes: (e.currentTarget as any)["affected-lanes"].value,
                      intersection: (e.currentTarget as any)["intersection"].value,
                      traffic_impact: (e.currentTarget as any)["traffic-impact"].value,
                    }
                    submitReport("traffic-light", payload)
                  }}
                  className="space-y-4"
                >
                  <Label>Fault Type</Label>
                  <Select name="fault-type" required>
                    <SelectTrigger><SelectValue placeholder="Select fault" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completely off">Completely Off</SelectItem>
                      <SelectItem value="one direction not working">One Direction Not Working</SelectItem>
                      <SelectItem value="stuck on red">Stuck on Red</SelectItem>
                      <SelectItem value="stuck on green">Stuck on Green</SelectItem>
                      <SelectItem value="flashing">Flashing</SelectItem>
                      <SelectItem value="timing issues">Timing Issues</SelectItem>
                    </SelectContent>
                  </Select>

                  <Label>Affected Lanes</Label>
                  <Select name="affected-lanes" required>
                    <SelectTrigger><SelectValue placeholder="Select lanes" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all directions">All Directions</SelectItem>
                      <SelectItem value="north-south">North-South</SelectItem>
                      <SelectItem value="east-west">East-West</SelectItem>
                      <SelectItem value="single lane">Single Lane</SelectItem>
                      <SelectItem value="turning lane only">Turning Lane Only</SelectItem>
                    </SelectContent>
                  </Select>

                  <Label>Intersection</Label>
                  <Input name="intersection" required />

                  <Label>Traffic Impact</Label>
                  <Textarea name="traffic-impact" />

                  <Button type="submit" className="bg-destructive" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Report Fault"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency */}
          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2">
                  <Users className="h-5 w-5 text-secondary" /> Emergency Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const payload = {
                      request_type: (e.currentTarget as any)["emergency-type"].value,
                      location: (e.currentTarget as any)["emergency-location"].value,
                      description: (e.currentTarget as any)["situation"].value,
                      contact_number: (e.currentTarget as any)["contact"].value,
                    }
                    submitReport("emergency", payload)
                  }}
                  className="space-y-4"
                >
                  <Label>Request Type</Label>
                  <Select name="emergency-type" required>
                    <SelectTrigger><SelectValue placeholder="Select request" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traffic director">Traffic Director</SelectItem>
                      <SelectItem value="emergency response">Emergency Response</SelectItem>
                      <SelectItem value="accident management">Accident Management</SelectItem>
                      <SelectItem value="event traffic support">Event Traffic Support</SelectItem>
                    </SelectContent>
                  </Select>

                  <Label>Location</Label>
                  <Input name="emergency-location" required />

                  <Label>Situation</Label>
                  <Textarea name="situation" />

                  <Label>Contact Number</Label>
                  <Input name="contact" type="tel" required />

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Send Emergency Request"}
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
