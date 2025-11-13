import * as React from "react";

import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";

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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = React.useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = React.useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
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
  );
};
