"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          console.error("Auth error:", error?.message);
          router.push("/auth");
          return;
        }

        const accessToken = data.session.access_token;

        // Call backend to create profile if not exists
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!resp.ok) {
          console.error("Profile creation failed:", await resp.json());
        }

        // Redirect to dashboard
        router.push("/map");
      } catch (err) {
        console.error("Callback error:", err);
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-20">Finishing sign-in…</p>;
  }

  return null;
}
