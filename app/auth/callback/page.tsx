"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.error("Auth error:", error?.message);
        router.push("/auth");
        return;
      }

      const accessToken = data.session.access_token;

      // Call backend to insert into profiles
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      router.push("/dashboard"); // or wherever
    };

    handleCallback();
  }, [router]);

  return <p className="text-center mt-20">Finishing sign-in…</p>;
}
