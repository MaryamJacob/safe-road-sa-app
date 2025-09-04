import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, MapPin, Shield, Users, Phone, Navigation } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-zinc-900 text-black dark:text-white min-h-screen">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">SafeRoad SA</span>
          </div>
          <Button asChild size="sm">
            <Link href="/auth">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-6xl font-bold text-balance mb-6">
            Making South African Roads
            <span className="text-primary"> Safer Together</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Report road hazards, request infrastructure improvements, and stay informed about traffic safety in your
            community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/report">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Report an Issue
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/map">
                <MapPin className="mr-2 h-5 w-5" />
                View Safety Map
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">How SafeRoad SA Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card>
              <CardHeader className="pb-3">
                <AlertTriangle className="h-8 w-8 md:h-10 md:w-10 text-secondary mb-2" />
                <CardTitle className="text-base md:text-lg">Report Issues</CardTitle>
                <CardDescription className="text-sm">
                  Quickly report potholes, obstructions, faulty traffic lights, and other road hazards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Upload photos for evidence</li>
                  <li>• Set severity levels</li>
                  <li>• GPS location tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <MapPin className="h-8 w-8 md:h-10 md:w-10 text-secondary mb-2" />
                <CardTitle className="text-base md:text-lg">Interactive Map</CardTitle>
                <CardDescription className="text-sm">
                  View real-time reports and safety alerts on an interactive map of your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Live hazard locations</li>
                  <li>• Severity-based markers</li>
                  <li>• Alternative route suggestions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Users className="h-8 w-8 md:h-10 md:w-10 text-secondary mb-2" />
                <CardTitle className="text-base md:text-lg">Community Verification</CardTitle>
                <CardDescription className="text-sm">
                  Help verify reports from other users to build a trusted safety network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Upvote confirmed hazards</li>
                  <li>• Community-driven accuracy</li>
                  <li>• Real-time status updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Navigation className="h-8 w-8 md:h-10 md:w-10 text-secondary mb-2" />
                <CardTitle className="text-base md:text-lg">Infrastructure Requests</CardTitle>
                <CardDescription className="text-sm">
                  Request new traffic lights, road improvements, and infrastructure changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Submit improvement requests</li>
                  <li>• Track request status</li>
                  <li>• Municipal integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Phone className="h-8 w-8 md:h-10 md:w-10 text-secondary mb-2" />
                <CardTitle className="text-base md:text-lg">Emergency Support</CardTitle>
                <CardDescription className="text-sm">
                  Request traffic directors and emergency assistance for major incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Traffic director requests</li>
                  <li>• Emergency contact directory</li>
                  <li>• Incident escalation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Shield className="h-8 w-8 md:h-10 md:w-10 text-secondary mb-2" />
                <CardTitle className="text-base md:text-lg">Safety Education</CardTitle>
                <CardDescription className="text-sm">Access safety tips, tutorials, and information about high-risk areas</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Hijacking hotspot alerts</li>
                  <li>• Emergency repair tutorials</li>
                  <li>• Safety best practices</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Join the SafeRoad SA Community</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Together, we can make South African roads safer for everyone. Start reporting issues and help build a
            comprehensive safety network.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 md:py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-primary">SafeRoad SA</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making South African roads safer through community reporting and civic engagement.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm md:text-base">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/report" className="hover:text-primary">
                    Report Issues
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="hover:text-primary">
                    Safety Map
                  </Link>
                </li>
                <li>
                  <Link href="/education" className="hover:text-primary">
                    Safety Hub
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm md:text-base">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-primary">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm md:text-base">Emergency</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Police: 10111</li>
                <li>Ambulance: 10177</li>
                <li>Fire: 10111</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-6 md:mt-8 pt-6 md:pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SafeRoad SA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
