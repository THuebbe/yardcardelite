"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { AuthProvider } from "@/components/auth/AuthContext";
import { UserProvider } from "@/contexts/UserContext";

// Import DashboardSidebar with a dynamic import to avoid server component issues
import dynamic from "next/dynamic";
const DashboardSidebar = dynamic(
  () =>
    import("@/components/layout/dashboard-sidebar").then((mod) => mod.default),
  { ssr: false },
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <AuthProvider>
      <UserProvider>
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <DashboardSidebar />
          <main className="flex flex-col dashboard-background">{children}</main>
        </div>
      </UserProvider>
    </AuthProvider>
  );
}
