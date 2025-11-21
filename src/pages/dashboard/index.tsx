import Head from "next/head";
import { useRouter } from "next/router";
import { Eye } from "lucide-react";
import * as React from "react";

import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { VendedTokensChart } from "@/components/VendedTokensChart";
import { RecentTransactionsTable } from "@/components/RecentTransactionsTable";
import { partnerTransactions } from "@/api/transactions/transactions.mock";
import { useProfile } from "@/contexts/ProfileContext";

import type { NextPageWithLayout } from "../_app";

const DashboardPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [showBalance, setShowBalance] = React.useState(true);
  const { profile } = useProfile();

  const recentTransactions = partnerTransactions.slice(0, 1);
  const walletBalance = profile?.wallet.balance || "0.00";

  const stats = [
    {
      title: "Vended Tokens (kWh)",
      value: showBalance ? "402,600.40 kWh" : "•••••••",
      subtitle: "Since last month",
      trend: { value: "2.15%", isPositive: true },
    },
    {
      title: "Revenue",
      value: showBalance ? "N2,625,600.00" : "•••••••",
      subtitle: "Since last month",
      trend: { value: "2.15%", isPositive: true },
    },
    {
      title: "Successful Transactions",
      value: "865",
      subtitle: "Since last month",
      trend: { value: "2.15%", isPositive: true },
    },
    {
      title: "Failed Transactions",
      value: "16",
      subtitle: "Since last month",
      trend: { value: "6.15%", isPositive: false },
    },
  ];

  return (
    <>
      <Head>
        <title>NESCO Partners · Dashboard</title>
      </Head>

      <section className="space-y-6">
        <div className="rounded-2xl border border-brand-border-light bg-brand-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-brand-ash">
                Wallet Balance (₦)
              </p>
              <div className="mt-2 flex items-center gap-3">
                <h2 className="text-3xl font-bold text-brand-black">
                  {showBalance ? `₦${walletBalance}` : "•••••••"}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowBalance(!showBalance)}
                  className="rounded-lg p-2 text-brand-ash hover:bg-brand-light-bg hover:text-brand-black transition-fx"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <VendedTokensChart />

        <RecentTransactionsTable
          transactions={recentTransactions}
          onViewAll={() => router.push("/dashboard/transactions")}
        />
      </section>
    </>
  );
};

DashboardPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DashboardPage;
