import * as React from "react";
import { useRouter } from "next/router";

import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";

export type DashboardLayoutProps = {
  heading?: string;
  byText?: string;
  children: React.ReactNode;
};

export const DashboardLayout = ({
  heading = "Dashboard",
  byText = "Welcome back! Here's what's happening today",
  children,
}: DashboardLayoutProps) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  // Auto-logout after 1 hour of inactivity
  useInactivityLogout(60);

  // Check authentication on mount
  React.useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") {
      setIsCheckingAuth(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    
    if (!token) {
      // Redirect to login if no token
      router.replace("/auth/login");
      return;
    }

    setIsCheckingAuth(false);
  }, [router]);

  const toggleSidebar = React.useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = React.useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Show nothing while checking authentication
  if (isCheckingAuth) {
    return null;
  }

  return (
    <ProfileProvider>
      <div className="min-h-screen bg-brand-light-bg text-brand-black">
        <div className="lg:pl-60">
          <DashboardSidebar
            isOpen={isSidebarOpen}
            onToggle={toggleSidebar}
            onClose={closeSidebar}
          />

          <div className="flex min-h-screen flex-col">
            <DashboardHeader
              heading={heading}
              byText={byText}
              onToggleSidebar={toggleSidebar}
            />

            <main className="flex-1 px-4 py-8 lg:px-8">
              <div className="mx-auto flex w-full flex-col gap-6 lg:gap-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
};
