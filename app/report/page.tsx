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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Show success message or redirect
    }, 2000)
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hazard-type">Hazard Type</Label>
                      <Select>
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
                      <RadioGroup defaultValue="medium" className="flex gap-4">
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
                        value={currentLocation}
                        onChange={(e) => setCurrentLocation(e.target.value)}
                        className="flex-1"
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

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="request-type">Request Type</Label>
                      <Select>
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
                      <Select>
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="infra-photos">Supporting Photos (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input type="file" id="infra-photos" multiple accept="image/*" className="hidden" />
                      <Label htmlFor="infra-photos" className="cursor-pointer">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload photos of the current situation</p>
                      </Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fault-type">Fault Type</Label>
                      <Select>
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
                      <Select>
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
                    <Input id="intersection" placeholder="e.g., Main St & Oak Ave" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="traffic-impact">Traffic Impact</Label>
                    <Textarea
                      id="traffic-impact"
                      placeholder="Describe how this is affecting traffic flow..."
                      className="min-h-[80px]"
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="emergency-type">Request Type</Label>
                    <Select>
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
                    <Input id="emergency-location" placeholder="Exact intersection or address" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="situation">Situation Description</Label>
                    <Textarea
                      id="situation"
                      placeholder="Describe the current situation and why assistance is needed..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Your Contact Number</Label>
                    <Input id="contact" type="tel" placeholder="+27 XX XXX XXXX" />
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

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
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
