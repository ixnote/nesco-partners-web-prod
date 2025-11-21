import { BellIcon } from "lucide-react";
import * as React from "react";
import { useRouter } from "next/router";
import { useProfile } from "@/contexts/ProfileContext";

export type DashboardHeaderProps = {
  heading: string;
  byText: string;
  onToggleSidebar: () => void;
};

export const DashboardHeader = ({
  heading,
  byText,
  onToggleSidebar,
}: DashboardHeaderProps) => {
  const router = useRouter();
  const { profile } = useProfile();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = profile ? getInitials(profile.name) : "AU";
  const displayName = profile?.name || "Admin User";
  const displayEmail = profile?.email || "admin@gmail.com";
  const hasNotifications = profile && profile.notification_count > 0;

  return (
    <header className="sticky top-0 z-10 border-b border-brand-border-light bg-brand-white/90 px-4 py-4 backdrop-blur-lg lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border-light bg-brand-white text-lg font-semibold text-brand-main shadow-sm shadow-brand-black/5 transition hover:bg-brand-light-bg lg:hidden"
          >
            ☰
          </button>
          <div>
            <h1 className="text-base font-medium text-brand-black lg:text-lg">
              {heading}
            </h1>
            <p className="text-xs text-brand-ash lg:text-sm">{byText}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/notifications")}
            className="hidden group relative items-center gap-3 rounded-full cursor-pointer border border-brand-border-light bg-brand-white px-4 py-2 text-sm text-brand-ash shadow-sm shadow-brand-black/5 hover:bg-brand-light-bg md:flex"
          >
            <BellIcon className="h-5 w-5" />
            {hasNotifications && (
              <span className="absolute top-2 right-4 w-2 h-2 bg-brand-failed-text rounded-full"></span>
            )}
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-main text-brand-white text-sm font-semibold">
            {initials}
          </div>
          <div className="hidden lg:block">
            <h1 className="text-sm font-normal text-brand-black lg:text-base">
              {displayName}
            </h1>
            <p className="text-xs text-brand-ash lg:text-sm">{displayEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
