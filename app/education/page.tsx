"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
  BookOpen,
  AlertTriangle,
  Phone,
  MapPin,
  Search,
  Car,
  Wrench,
  Clock,
  ExternalLink,
  ArrowLeft,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect } from "react";

// Mock data for safety education
const emergencyContacts = [
  {
    category: "Emergency Services",
    contacts: [
      {
        name: "Police Emergency",
        number: "10111",
        description: "Crime, accidents, emergencies",
      },
      {
        name: "Ambulance/Medical",
        number: "10177",
        description: "Medical emergencies",
      },
      {
        name: "Fire Department",
        number: "10111",
        description: "Fire emergencies",
      },
    ],
  },
  {
    category: "Roadside Assistance",
    contacts: [
      {
        name: "AA Emergency Road Service",
        number: "0861 000 234",
        description: "24/7 roadside assistance",
      },
      {
        name: "Outsurance",
        number: "0860 468 772",
        description: "Insurance roadside assistance",
      },
      {
        name: "MiWay",
        number: "0860 649 292",
        description: "Insurance emergency assistance",
      },
    ],
  },
  {
    category: "Towing Services",
    contacts: [
      {
        name: "National Towing",
        number: "0861 869 464",
        description: "24/7 towing service",
      },
      {
        name: "City Towing",
        number: "011 234 5678",
        description: "Johannesburg area towing",
      },
      {
        name: "Cape Towing",
        number: "021 345 6789",
        description: "Cape Town area towing",
      },
    ],
  },
];

const safetyTips = [
  {
    category: "Vehicle Safety",
    tips: [
      "Always lock your doors and keep windows slightly open for ventilation",
      "Keep your fuel tank at least half full to avoid running out in unsafe areas",
      "Regular vehicle maintenance prevents breakdowns in dangerous locations",
      "Keep emergency supplies: water, blanket, flashlight, and first aid kit",
    ],
  },
  {
    category: "Driving Safety",
    tips: [
      "Avoid driving at night in high-risk areas when possible",
      "Stay alert at traffic lights - be aware of your surroundings",
      "Don't stop for strangers or hitchhikers",
      "Keep doors locked and windows up in heavy traffic",
    ],
  },
  {
    category: "Hijacking Prevention",
    tips: [
      "Be extra cautious when approaching your driveway - check for suspicious activity",
      "Vary your routes and times to avoid predictable patterns",
      "If followed, drive to the nearest police station or busy public area",
      "Don't resist during a hijacking - your life is more valuable than your car",
    ],
  },
];

const tutorials = [
  {
    id: 1,
    title: "How to Change a Tire",
    duration: "10 minutes",
    difficulty: "Beginner",
    category: "Vehicle Maintenance",
    description:
      "Step-by-step guide to safely changing a flat tire on the roadside",
    steps: [
      "Find a safe, flat location away from traffic",
      "Turn on hazard lights and apply parking brake",
      "Place wheel wedges behind tires (opposite end of car from flat)",
      "Remove hubcap or wheel cover and loosen lug nuts",
      "Use jack to lift vehicle off the ground",
      "Remove lug nuts completely and pull tire toward you to remove",
      "Align spare tire with wheel bolts and push onto wheel hub",
      "Replace lug nuts and tighten by hand",
      "Lower vehicle and tighten lug nuts with wrench",
      "Check spare tire pressure and drive carefully to nearest service station",
    ],
  },
  {
    id: 2,
    title: "Jump Starting Your Car",
    duration: "5 minutes",
    difficulty: "Beginner",
    category: "Vehicle Maintenance",
    description: "How to safely jump start a car with a dead battery",
    steps: [
      "Position the working vehicle close enough for jumper cables to reach",
      "Turn off both vehicles and engage parking brakes",
      "Identify positive and negative terminals on both batteries",
      "Connect red cable to dead battery's positive terminal",
      "Connect other red end to working battery's positive terminal",
      "Connect black cable to working battery's negative terminal",
      "Connect other black end to unpainted metal surface in dead car",
      "Start the working vehicle and let it run for 2-3 minutes",
      "Try starting the dead vehicle",
      "Remove cables in reverse order once car starts",
    ],
  },
  {
    id: 3,
    title: "What to Do During a Hijacking",
    duration: "3 minutes",
    difficulty: "Critical",
    category: "Personal Safety",
    description:
      "Essential safety protocols if you become a victim of hijacking",
    steps: [
      "Stay calm and don't panic - your life is the priority",
      "Don't resist or fight back - comply with demands",
      "Keep your hands visible and move slowly",
      "Don't make eye contact that could be seen as threatening",
      "Give up your vehicle and belongings without argument",
      "Try to remember details about the perpetrators for police",
      "Move away from the scene quickly once released",
      "Call police (10111) and your insurance company immediately",
      "Seek medical attention if needed, even for shock",
      "Report to nearest police station for case number",
    ],
  },
];

const hotspots = [
  {
    area: "Johannesburg CBD",
    riskLevel: "High",
    commonCrimes: ["Hijacking", "Smash & Grab", "Robbery"],
    safetyTips:
      "Avoid stopping at traffic lights, keep windows up, don't display valuables",
    bestTimes: "Avoid after 6 PM and weekends",
  },
  {
    area: "Cape Town N2 Highway",
    riskLevel: "Medium",
    commonCrimes: ["Stone throwing", "Hijacking"],
    safetyTips:
      "Don't stop if stones are thrown, drive to nearest police station",
    bestTimes: "Daylight hours preferred",
  },
  {
    area: "Durban Beachfront",
    riskLevel: "Medium",
    commonCrimes: ["Smash & Grab", "Theft"],
    safetyTips: "Park in secure areas, don't leave items visible in car",
    bestTimes: "Busy daylight hours",
  },
  {
    area: "Pretoria East",
    riskLevel: "High",
    commonCrimes: ["House robberies", "Hijacking"],
    safetyTips: "Be extra cautious approaching home, check for followers",
    bestTimes: "Vary arrival times",
  },
];

export default function EducationPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTutorial, setSelectedTutorial] = useState<
    (typeof tutorials)[0] | null
  >(null);

  const filteredTutorials = tutorials.filter(
    (tutorial) =>
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "High":
        return <Badge variant="destructive">High Risk</Badge>;
      case "Medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
        );
      case "Low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "Intermediate":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Intermediate</Badge>
        );
      case "Beginner":
        return <Badge className="bg-green-100 text-green-800">Beginner</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between container">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary">Safety Hub</span>
          </div>
          <div className="flex items-center space-x-2">
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

      <div className="container max-w-6xl mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Safety Education Hub
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Essential safety information, tutorials, and resources for South
            African road users.
          </p>
        </div>

        <Tabs defaultValue="tutorials" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="tutorials" className="text-xs md:text-sm">
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="safety-tips" className="text-xs md:text-sm">
              Safety Tips
            </TabsTrigger>
            <TabsTrigger value="hotspots" className="text-xs md:text-sm">
              Risk Areas
            </TabsTrigger>
            <TabsTrigger value="emergency" className="text-xs md:text-sm">
              Emergency
            </TabsTrigger>
          </TabsList>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">
                  Safety Tutorials
                </h2>
                <p className="text-muted-foreground text-sm">
                  Learn essential skills for road safety and emergency
                  situations
                </p>
              </div>
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredTutorials.map((tutorial) => (
                <Card
                  key={tutorial.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {tutorial.category === "Vehicle Maintenance" ? (
                          <Wrench className="h-5 w-5 text-primary" />
                        ) : tutorial.category === "Personal Safety" ? (
                          <Shield className="h-5 w-5 text-secondary" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {tutorial.category}
                        </Badge>
                      </div>
                      {getDifficultyBadge(tutorial.difficulty)}
                    </div>
                    <CardTitle className="text-base md:text-lg">
                      {tutorial.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {tutorial.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {tutorial.duration}
                        </div>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full"
                          onClick={() => setSelectedTutorial(tutorial)}
                        >
                          View Tutorial
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {tutorial.category === "Vehicle Maintenance" ? (
                              <Wrench className="h-5 w-5 text-primary" />
                            ) : tutorial.category === "Personal Safety" ? (
                              <Shield className="h-5 w-5 text-secondary" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-blue-600" />
                            )}
                            {tutorial.title}
                          </DialogTitle>
                          <DialogDescription>
                            {tutorial.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            {getDifficultyBadge(tutorial.difficulty)}
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {tutorial.duration}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-3">
                              Step-by-Step Instructions:
                            </h4>
                            <ol className="space-y-2">
                              {tutorial.steps.map((step, index) => (
                                <li key={index} className="flex gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                  </span>
                                  <span className="text-sm">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                          {tutorial.category === "Personal Safety" && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                <span className="font-medium text-destructive">
                                  Important Safety Notice
                                </span>
                              </div>
                              <p className="text-sm text-destructive/80">
                                Your personal safety is the top priority. Never
                                put yourself at additional risk.
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Safety Tips Tab */}
          <TabsContent value="safety-tips" className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Safety Tips & Best Practices
              </h2>
              <p className="text-muted-foreground text-sm">
                Essential safety guidelines for South African road conditions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {safetyTips.map((category, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      {category.category === "Vehicle Safety" ? (
                        <Car className="h-5 w-5 text-primary" />
                      ) : category.category === "Driving Safety" ? (
                        <Shield className="h-5 w-5 text-blue-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-secondary" />
                      )}
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Safety Resources */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg">
                  Additional Safety Resources
                </CardTitle>
                <CardDescription className="text-sm">
                  External resources for comprehensive road safety education
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm md:text-base">
                        Road Traffic Management Corporation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Official road safety guidelines
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm md:text-base">
                        South African Police Service
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Crime prevention tips
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Areas Tab */}
          <TabsContent value="hotspots" className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">High-Risk Areas</h2>
              <p className="text-muted-foreground text-sm">
                Known crime hotspots and safety information for major South
                African areas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {hotspots.map((hotspot, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <MapPin className="h-5 w-5 text-destructive" />
                        {hotspot.area}
                      </CardTitle>
                      {getRiskBadge(hotspot.riskLevel)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-sm">
                        Common Crimes:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {hotspot.commonCrimes.map((crime, crimeIndex) => (
                          <Badge
                            key={crimeIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {crime}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Safety Tips:</h4>
                      <p className="text-sm text-muted-foreground">
                        {hotspot.safetyTips}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-sm">
                        Best Times to Travel:
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {hotspot.bestTimes}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  General Precautions for High-Risk Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-sm">
                      Before Traveling:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        Plan your route and inform someone of your travel plans
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        Check current crime reports for your route
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        Ensure your vehicle is in good condition
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        Keep emergency contacts readily available
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-sm">
                      While Traveling:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        Stay alert and avoid distractions
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        Keep doors locked and windows up
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        Don't display valuable items
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        Trust your instincts - if something feels wrong, leave
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Contacts Tab */}
          <TabsContent value="emergency" className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Emergency Contacts
              </h2>
              <p className="text-muted-foreground text-sm">
                Essential phone numbers for emergencies, roadside assistance,
                and support services
              </p>
            </div>

            <div className="space-y-6">
              {emergencyContacts.map((category, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <Phone className="h-5 w-5 text-primary" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.contacts.map((contact, contactIndex) => (
                        <div
                          key={contactIndex}
                          className="p-4 border rounded-lg"
                        >
                          <h4 className="font-medium mb-1 text-sm md:text-base">
                            {contact.name}
                          </h4>
                          <div className="text-lg font-bold text-primary mb-2">
                            <a
                              href={`tel:${contact.number}`}
                              className="hover:underline"
                            >
                              {contact.number}
                            </a>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {contact.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Emergency Preparedness */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <AlertTriangle className="h-5 w-5 text-secondary" />
                  Emergency Preparedness Checklist
                </CardTitle>
                <CardDescription className="text-sm">
                  Keep these items in your vehicle at all times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-sm">
                      Essential Items:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-primary">✓</span>
                        First aid kit
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">✓</span>
                        Flashlight with extra batteries
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">✓</span>
                        Jumper cables
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">✓</span>
                        Spare tire (properly inflated)
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">✓</span>
                        Jack and lug wrench
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">✓</span>
                        Emergency water and snacks
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-sm">
                      Important Documents:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-primary">✓</span>
                        Driver's license
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">✓</span>
                        Vehicle registration
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">✓</span>
                        Insurance documents
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">✓</span>
                        Emergency contact list
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">✓</span>
                        Medical information (if applicable)
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">✓</span>
                        Roadside assistance membership cards
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
