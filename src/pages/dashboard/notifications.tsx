import Head from "next/head";

import { DashboardLayout } from "@/components/DashboardLayout";

import type { NextPageWithLayout } from "../_app";

const notificationCategories = [
  {
    title: "System Alerts",
    description: "Infrastructure and platform notices.",
  },
  {
    title: "Partner Activity",
    description: "Events triggered by partner accounts.",
  },
  {
    title: "Customer Updates",
    description: "Customer-facing changes and receipts.",
  },
];

const notificationFeed = [
  {
    id: "NTF-9843",
    title: "High value transaction flagged",
    time: "1 min ago",
    detail: "Samuel Jackson initiated ₦950,000.00 token purchase.",
    type: "alert",
  },
  {
    id: "NTF-9838",
    title: "Wallet reconciliation completed",
    time: "8 mins ago",
    detail: "NESCO Wallet settlement batch 18 successful.",
    type: "success",
  },
  {
    id: "NTF-9827",
    title: "Support ticket escalated",
    time: "24 mins ago",
    detail: "Meter synchronization delay moved to Level 2.",
    type: "warning",
  },
  {
    id: "NTF-9819",
    title: "New partner joined",
    time: "1 hr ago",
    detail: "Infinity Utilities completed onboarding.",
    type: "info",
  },
];

const typeBadgeStyles: Record<string, string> = {
  alert: "bg-brand-failed-bg text-brand-failed-text",
  success: "bg-brand-success-bg text-brand-success-text",
  warning: "bg-brand-pending-bg text-brand-pending-text",
  info: "bg-brand-main-bg text-brand-main",
};

const NotificationsPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>NESCO Partners · Notifications</title>
      </Head>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-border-light bg-brand-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-brand-black">
                  Notification Feed
                </h2>
                <p className="text-sm text-brand-ash">
                  Review recent activity and platform alerts across your
                  organization.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="transition-fx inline-flex items-center rounded-lg border border-brand-border-light px-4 py-2 text-sm font-medium text-brand-ash hover:border-brand-main hover:text-brand-main"
                >
                  Mark all as read
                </button>
                <button
                  type="button"
                  className="transition-fx inline-flex items-center rounded-lg border border-brand-border-light px-4 py-2 text-sm font-medium text-brand-ash hover:border-brand-main hover:text-brand-main"
                >
                  Notification Settings
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {notificationFeed.map((notification) => (
                <div
                  key={notification.id}
                  className="transition-fx rounded-xl border border-brand-border-light bg-brand-light-bg/60 px-4 py-3 hover:border-brand-main"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-brand-black">
                          {notification.title}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${typeBadgeStyles[notification.type]}`}
                        >
                          {notification.type}
                        </span>
                      </div>
                      <p className="text-sm text-brand-ash">
                        {notification.detail}
                      </p>
                    </div>
                    <span className="text-xs text-brand-ash">
                      {notification.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-brand-border-light bg-brand-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-brand-black">
              Notification Channels
            </h3>
            <p className="mt-2 text-sm text-brand-ash">
              Configure the pathways used to deliver alerts to your team.
            </p>

            <div className="mt-4 space-y-3 text-sm">
              {notificationCategories.map((category) => (
                <div
                  key={category.title}
                  className="transition-fx rounded-lg border border-brand-border-light px-4 py-3 hover:border-brand-main hover:text-brand-main"
                >
                  <p className="font-medium">{category.title}</p>
                  <p className="text-brand-ash">{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-brand-border-light bg-brand-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-brand-black">
              Digest Schedule
            </h3>
            <p className="mt-2 text-sm text-brand-ash">
              Determine how frequently administrators receive roll-up summaries.
            </p>

            <ul className="mt-4 space-y-3 text-sm text-brand-black">
              <li className="transition-fx rounded-lg border border-brand-border-light px-4 py-3 hover:border-brand-main hover:text-brand-main">
                Daily at 08:00 AM
              </li>
              <li className="transition-fx rounded-lg border border-brand-border-light px-4 py-3 hover:border-brand-main hover:text-brand-main">
                Weekly on Mondays
              </li>
              <li className="transition-fx rounded-lg border border-brand-border-light px-4 py-3 hover:border-brand-main hover:text-brand-main">
                Monthly executive summary
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
};

NotificationsPage.getLayout = (page) => (
  <DashboardLayout
    heading="Notifications"
    byText="Stay informed about platform and account activities."
  >
    {page}
  </DashboardLayout>
);

export default NotificationsPage;
