import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, MapPin, Shield, Users, Phone, Navigation } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">SafeRoad SA</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/report" className="text-sm font-medium hover:text-primary transition-colors">
              Report Issue
            </Link>
            <Link href="/map" className="text-sm font-medium hover:text-primary transition-colors">
              Safety Map
            </Link>
            <Link href="/education" className="text-sm font-medium hover:text-primary transition-colors">
              Safety Hub
            </Link>
            <Link href="/auth" className="text-sm font-medium hover:text-primary transition-colors">
              Sign In
            </Link>
          </nav>
          <Button asChild className="md:hidden">
            <Link href="/auth">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Making South African Roads
            <span className="text-primary"> Safer Together</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
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
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How SafeRoad SA Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <AlertTriangle className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Report Issues</CardTitle>
                <CardDescription>
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
              <CardHeader>
                <MapPin className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Interactive Map</CardTitle>
                <CardDescription>
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
              <CardHeader>
                <Users className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Community Verification</CardTitle>
                <CardDescription>
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
              <CardHeader>
                <Navigation className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Infrastructure Requests</CardTitle>
                <CardDescription>
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
              <CardHeader>
                <Phone className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Emergency Support</CardTitle>
                <CardDescription>
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
              <CardHeader>
                <Shield className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Safety Education</CardTitle>
                <CardDescription>Access safety tips, tutorials, and information about high-risk areas</CardDescription>
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
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join the SafeRoad SA Community</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Together, we can make South African roads safer for everyone. Start reporting issues and help build a
            comprehensive safety network.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
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
              <h3 className="font-semibold mb-4">Features</h3>
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
              <h3 className="font-semibold mb-4">Support</h3>
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
              <h3 className="font-semibold mb-4">Emergency</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Police: 10111</li>
                <li>Ambulance: 10177</li>
                <li>Fire: 10111</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SafeRoad SA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
