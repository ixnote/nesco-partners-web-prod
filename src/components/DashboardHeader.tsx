import { BellIcon, Loader2 } from "lucide-react";
import * as React from "react";
import { useRouter } from "next/router";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useProfile } from "@/contexts/ProfileContext";
import { getNotifications, markNotificationsRead, mapNotification } from "@/api/notifications";
import type { Notification } from "@/api/notifications";

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
  const { profile, refetchProfile } = useProfile();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

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

  // Fetch recent notifications when dropdown opens
  const fetchNotifications = React.useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) return;

    setIsLoadingNotifications(true);
    const result = await getNotifications(token, 1);
    if (result.success) {
      const mapped = result.data.data.notifications.map(mapNotification).slice(0, 5); // Show latest 5
      setNotifications(mapped);
    }
    setIsLoadingNotifications(false);
  }, []);

  // Fetch notifications when dropdown opens
  React.useEffect(() => {
    if (isDropdownOpen) {
      fetchNotifications();
    }
  }, [isDropdownOpen, fetchNotifications]);

  const handleNotificationClick = React.useCallback(async (notification: Notification) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    
    // Mark as read if unread
    if (!notification.isRead && token) {
      await markNotificationsRead(token, [notification.apiId]);
      refetchProfile(); // Update notification count in header
    }
    
    // Navigate to notifications page with the notification ID
    router.push(`/dashboard/notifications?id=${notification.apiId}`);
    setIsDropdownOpen(false);
  }, [router, refetchProfile]);

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
          {/* Account Mode Indicator */}
          {profile?.account_mode && (
            <div
              className={`hidden rounded-full px-3 py-1.5 text-xs font-medium md:flex ${
                profile.account_mode === "live"
                  ? "bg-brand-success-bg text-brand-success-text"
                  : "bg-brand-pending-bg text-brand-pending-text"
              }`}
            >
              {profile.account_mode === "live" ? "Live" : "Sandbox"}
            </div>
          )}
          <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="hidden group relative items-center gap-3 rounded-full cursor-pointer border border-brand-border-light bg-brand-white px-4 py-2 text-sm text-brand-ash shadow-sm shadow-brand-black/5 hover:bg-brand-light-bg md:flex"
              >
                <BellIcon className="h-5 w-5" />
                {hasNotifications && (
                  <span className="absolute top-2 right-4 w-2 h-2 bg-brand-failed-text rounded-full"></span>
                )}
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={8}
                align="end"
                className="w-80 rounded-lg border border-brand-border-light bg-brand-white p-2 shadow-lg focus:outline-none z-50"
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-brand-border-light">
                  <h3 className="text-sm font-semibold text-brand-black">Notifications</h3>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/notifications")}
                    className="text-xs text-brand-main hover:text-brand-main/80 transition"
                  >
                    View All
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {isLoadingNotifications ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-brand-main" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-brand-ash">
                      No notifications
                    </div>
                  ) : (
                    <div className="py-1">
                      {notifications.map((notification) => (
                        <DropdownMenu.Item
                          key={notification.id}
                          onSelect={() => handleNotificationClick(notification)}
                          className="transition-fx flex cursor-pointer items-start gap-3 rounded-md px-3 py-3 text-sm outline-none hover:bg-brand-light-bg focus:bg-brand-light-bg"
                        >
                          <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-main text-xs font-semibold text-brand-white">
                            {getInitials(notification.sender)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-brand-black">
                                {notification.title}
                              </span>
                              {!notification.isRead && (
                                <span className="w-2 h-2 bg-brand-main rounded-full"></span>
                              )}
                            </div>
                            <p className="text-xs text-brand-ash line-clamp-2 break-words">
                              {notification.description}
                            </p>
                            <p className="text-xs text-brand-ash mt-1">{notification.time}</p>
                          </div>
                        </DropdownMenu.Item>
                      ))}
                    </div>
                  )}
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
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
