"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Error during Google login:", error.message);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (
      document.getElementById("signin-password") as HTMLInputElement
    ).value;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error during sign in:", error.message);
    }

    setIsLoading(false);
  };
  //EMAIL ISSSSSSSUEEEEEEEE
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const name = formData.get("name") as string;
    const email = formData.get("signup-email") as string;
    const password = formData.get("signup-password") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;

    // Add email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Sign up error:", error.message);
        alert(`Error: ${error.message}`);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Add error handling for profile creation
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: name.trim(),
          phone: phone.trim(),
          location: location.trim(),
        });

        if (profileError) {
          console.error("Profile creation error:", profileError.message);
          alert(
            "Account created but profile setup failed. Please update your profile later."
          );
        }
      }

      alert("Account created! Please check your email for verification.");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">SafeRoad SA</span>
          </Link>
          <h1 className="text-2xl font-bold">Join the Safety Community</h1>
          <p className="text-muted-foreground mt-2">
            Help make South African roads safer for everyone
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In */}
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your SafeRoad SA account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type={showSignInPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowSignInPassword(!showSignInPassword)
                        }
                        className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground"
                      >
                        {showSignInPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Processing..." : "Sign In"}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-4">
                  <span className="px-2 text-md  text-muted-foreground">
                    or
                  </span>
                </div>

                <Button
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border text-black hover:bg-gray-100"
                >
                  Continue with Google
                </Button>

                <div className="mt-4 text-center">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Up */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join SafeRoad SA and start making a difference
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+27 XX XXX XXXX"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">City/Area</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        type="text"
                        placeholder="Cape Town, Johannesburg, etc."
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowSignUpPassword(!showSignUpPassword)
                        }
                        className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground"
                      >
                        {showSignUpPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-4">
                  <span className="px-2 text-md text-muted-foreground">or</span>
                </div>

                <Button
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border text-black hover:bg-gray-100"
                >
                  Continue with Google
                </Button>

                <div className="mt-4 text-center text-xs text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
// "use client";

// import { Shield } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/supabaseClient";

// export default function AuthPage() {
//   const handleGoogleLogin = async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: `${window.location.origin}/auth/callback`,
//       },
//     });

//     if (error) {
//       console.error("Error during Google login:", error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-4">
//       <div className="w-full max-w-md text-center space-y-6">
//         {/* Logo + App Name */}
//         <Link href="/" className="inline-flex items-center space-x-2 mb-4">
//           <Shield className="h-10 w-10 text-primary" />
//           <span className="text-3xl font-bold text-primary">SafeRoad SA</span>
//         </Link>

//         {/* Heading */}
//         <div>
//           <h1 className="text-2xl font-bold">Join the Safety Community</h1>
//           <p className="text-muted-foreground mt-2">
//             Help make South African roads safer for everyone
//           </p>
//         </div>

//         {/* Google Login Button */}
//         <div className="pt-4">
//           <Button
//             onClick={handleGoogleLogin}
//             className="w-full bg-white border text-black hover:bg-gray-100 flex items-center justify-center space-x-2"
//           >
//             <img
//               src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
//               alt="Google logo"
//               className="h-5 w-5"
//             />
//             <span>Continue with Google</span>
//           </Button>
//         </div>

//         {/* Footer */}
//         <div className="mt-6 text-sm text-muted-foreground">
//           By continuing, you agree to our{" "}
//           <Link href="/terms" className="text-primary hover:underline">
//             Terms of Service
//           </Link>{" "}
//           and{" "}
//           <Link href="/privacy" className="text-primary hover:underline">
//             Privacy Policy
//           </Link>
//         </div>

//         <div className="mt-6">
//           <Link
//             href="/"
//             className="text-sm text-muted-foreground hover:text-primary"
//           >
//             ← Back to Home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
