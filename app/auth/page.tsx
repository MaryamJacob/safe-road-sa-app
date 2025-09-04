"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Logo + App Name */}
        <Link href="/" className="inline-flex items-center space-x-2 mb-4">
          <Shield className="h-10 w-10 text-primary" />
          <span className="text-3xl font-bold text-primary">SafeRoad SA</span>
        </Link>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold">Join the Safety Community</h1>
          <p className="text-muted-foreground mt-2">
            Help make South African roads safer for everyone
          </p>
        </div>

        {/* Google Login Button */}
        <div className="pt-4">
          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-white border text-black hover:bg-gray-100 flex items-center justify-center space-x-2"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="h-5 w-5"
            />
            <span>Continue with Google</span>
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </div>

        <div className="mt-6">
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
