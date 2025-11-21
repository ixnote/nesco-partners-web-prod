import Head from "next/head";
import { useRouter } from "next/router";
import { Eye, Loader2 } from "lucide-react";
import * as React from "react";

import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { VendedTokensChart } from "@/components/VendedTokensChart";
import { RecentTransactionsTable } from "@/components/RecentTransactionsTable";
import { getDashboardAnalytics, formatHighlights, mapRecentTransaction, formatTrendData } from "@/api/analytics";
import type { Transaction } from "@/components/TransactionTable";
import { useProfile } from "@/contexts/ProfileContext";

import type { NextPageWithLayout } from "../_app";

const DashboardPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [showBalance, setShowBalance] = React.useState(true);
  const { profile } = useProfile();
  
  const [analytics, setAnalytics] = React.useState<{
    highlights: ReturnType<typeof formatHighlights>;
    trend: ReturnType<typeof formatTrendData>;
    recentTransactions: Transaction[];
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const walletBalance = profile?.wallet.balance || "0.00";

  const token = React.useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }, []);

  // Fetch dashboard analytics
  const fetchAnalytics = React.useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    const result = await getDashboardAnalytics(token);

    if (result.success) {
      const highlights = formatHighlights(result.data.data.highlights);
      const trend = formatTrendData(result.data.data.trend);
      const recentTransactions = result.data.data.recentTransactions.map(mapRecentTransaction);

      setAnalytics({
        highlights,
        trend,
        recentTransactions,
      });
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  }, [token]);

  React.useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const stats = React.useMemo(() => {
    if (!analytics) return [];

    return [
      {
        title: "Vended Tokens (kWh)",
        value: showBalance ? analytics.highlights.vendedTokens.value : "•••••••",
        subtitle: "Since last month",
        trend: {
          value: analytics.highlights.vendedTokens.change,
          isPositive: analytics.highlights.vendedTokens.isPositive,
        },
      },
      {
        title: "Revenue",
        value: showBalance ? analytics.highlights.revenue.value : "•••••••",
        subtitle: "Since last month",
        trend: {
          value: analytics.highlights.revenue.change,
          isPositive: analytics.highlights.revenue.isPositive,
        },
      },
      {
        title: "Successful Transactions",
        value: analytics.highlights.successfulTransactions.value,
        subtitle: "Since last month",
        trend: {
          value: analytics.highlights.successfulTransactions.change,
          isPositive: analytics.highlights.successfulTransactions.isPositive,
        },
      },
      {
        title: "Failed Transactions",
        value: analytics.highlights.failedTransactions.value,
        subtitle: "Since last month",
        trend: {
          value: analytics.highlights.failedTransactions.change,
          isPositive: analytics.highlights.failedTransactions.isPositive,
        },
      },
    ];
  }, [analytics, showBalance]);

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

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-main" />
          </div>
        ) : analytics ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatsCard key={stat.title} {...stat} />
              ))}
            </div>

            <VendedTokensChart
              labels={analytics.trend.labels}
              vendedTokens={analytics.trend.vendedTokens}
              revenue={analytics.trend.revenue}
              useMockData={false}
            />

            <RecentTransactionsTable
              transactions={analytics.recentTransactions}
              onViewAll={() => router.push("/dashboard/transactions")}
            />
          </>
        ) : null}
      </section>
    </>
  );
};

DashboardPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DashboardPage;
