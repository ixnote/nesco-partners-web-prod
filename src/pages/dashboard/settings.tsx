import Head from "next/head";

import { DashboardLayout } from "@/components/DashboardLayout";

import type { NextPageWithLayout } from "../_app";

const preferenceSections = [
  {
    title: "Profile Information",
    description: "Manage your administrator identity and contact details.",
    fields: [
      { label: "Full Name", value: "Admin User" },
      { label: "Email Address", value: "admin@nesco.com" },
      { label: "Phone Number", value: "+234 700 000 0000" },
    ],
  },
  {
    title: "Security",
    description: "Keep your account secure with authentication controls.",
    fields: [
      { label: "Last Password Change", value: "Sep 18, 2025" },
      { label: "Two-Factor Authentication", value: "Enabled" },
      { label: "Login Alerts", value: "Via Email" },
    ],
  },
];

const notificationPreferences = [
  { label: "Partner activity summary", value: "Daily" },
  { label: "High value alerts", value: "Instant" },
  { label: "Monthly performance report", value: "Enabled" },
];

const SettingsPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>NESCO Partners · Settings</title>
      </Head>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          {preferenceSections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-brand-border-light bg-brand-white p-6 shadow-sm"
            >
              <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-brand-black">
                    {section.title}
                  </h2>
                  <p className="text-sm text-brand-ash">
                    {section.description}
                  </p>
                </div>
                <button
                  type="button"
                  className="transition-fx inline-flex items-center rounded-lg border border-brand-border-light px-4 py-2 text-sm font-medium text-brand-ash hover:border-brand-main hover:text-brand-main"
                >
                  Edit
                </button>
              </header>

              <dl className="mt-6 space-y-4 text-sm text-brand-black">
                {section.fields.map((field) => (
                  <div
                    key={field.label}
                    className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <dt className="text-brand-ash">{field.label}</dt>
                    <dd className="font-medium">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-brand-border-light bg-brand-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-brand-black">
              Notification Preferences
            </h3>
            <p className="mt-2 text-sm text-brand-ash">
              Choose how frequently you receive updates.
            </p>

            <ul className="mt-4 space-y-3 text-sm text-brand-black">
              {notificationPreferences.map((preference) => (
                <li
                  key={preference.label}
                  className="transition-fx flex items-center justify-between rounded-lg border border-brand-border-light px-4 py-3 hover:border-brand-main hover:text-brand-main"
                >
                  <span>{preference.label}</span>
                  <span className="text-brand-ash">{preference.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-brand-border-light bg-brand-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-brand-black">
              Danger Zone
            </h3>
            <p className="mt-2 text-sm text-brand-ash">
              Deactivate integrations or remove access when required.
            </p>

            <div className="mt-4 space-y-3">
              <button
                type="button"
                className="transition-fx w-full rounded-lg bg-brand-failed-bg px-4 py-2 text-sm font-semibold text-brand-failed-text hover:bg-brand-failed-text hover:text-brand-white"
              >
                Disable Partner API Access
              </button>
              <button
                type="button"
                className="transition-fx w-full rounded-lg border border-brand-border-light px-4 py-2 text-sm font-medium text-brand-ash hover:border-brand-main hover:text-brand-main"
              >
                Remove Device Sessions
              </button>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
};

SettingsPage.getLayout = (page) => (
  <DashboardLayout
    heading="Settings"
    byText="Adjust administrator preferences and security controls."
  >
    {page}
  </DashboardLayout>
);

export default SettingsPage;
