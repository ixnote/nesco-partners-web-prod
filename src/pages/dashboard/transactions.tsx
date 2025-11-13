import Head from "next/head";
import * as React from "react";
import { Search, WalletIcon, UsersIcon } from "lucide-react";

import { DashboardLayout } from "@/components/DashboardLayout";
import { TransactionTable } from "@/components/TransactionTable";
import { CustomerTransactionTable } from "@/components/CustomerTransactionTable";
import { TransactionDetailModal } from "@/components/TransactionDetailModal";
import type {
  Transaction,
  TransactionStatus,
} from "@/components/TransactionTable";
import type { CustomerTransaction } from "@/components/CustomerTransactionTable";
import {
  partnerTransactions,
  customerTransactions,
} from "@/api/transactions/transactions.mock";
import { StatusFilterDropdown } from "@/components/StatusFilterDropdown";
import {
  DateRangeFilterDropdown,
  type DateRangeFilterValue,
  type DateRangePreset,
} from "@/components/DateRangeFilterDropdown";
import type { DateRange } from "react-day-picker";

import type { NextPageWithLayout } from "../_app";

const TransactionsPage: NextPageWithLayout = () => {
  const [activeTab, setActiveTab] = React.useState<"wallet" | "customers">(
    "wallet"
  );
  const [selectedTransaction, setSelectedTransaction] = React.useState<
    Transaction | CustomerTransaction | null
  >(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | TransactionStatus
  >("all");
  const [dateFilter, setDateFilter] = React.useState<DateRangeFilterValue>({
    preset: "last_12_months",
  });
  const handleReportIssue = React.useCallback(
    (transaction: Transaction | CustomerTransaction) => {
      console.info("Report issue for transaction:", transaction.id);
    },
    []
  );

  const handleShareReceipt = React.useCallback(
    (transaction: Transaction | CustomerTransaction) => {
      console.info("Share receipt for transaction:", transaction.id);
    },
    []
  );

  const filteredWalletTransactions = React.useMemo(() => {
    if (statusFilter === "all") {
      return partnerTransactions;
    }

    return partnerTransactions.filter(
      (transaction) => transaction.status === statusFilter
    );
  }, [statusFilter]);

  const filteredCustomerTransactions = React.useMemo(() => {
    if (statusFilter === "all") {
      return customerTransactions;
    }

    return customerTransactions.filter(
      (transaction) => transaction.status === statusFilter
    );
  }, [statusFilter]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handleDatePresetChange = React.useCallback(
    (preset: DateRangePreset) => {
      setDateFilter((previous) => ({
        preset,
        range: preset === "custom" ? previous.range : undefined,
      }));
    },
    []
  );

  const handleCustomRangeChange = React.useCallback(
    (range: DateRange | undefined) => {
      setDateFilter((previous) => ({
        preset: range ? "custom" : previous.preset,
        range,
      }));
    },
    []
  );

  return (
    <>
      <Head>
        <title>NESCO Partners · Transactions</title>
      </Head>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 border-b border-brand-border-light">
            <button
              type="button"
              onClick={() => setActiveTab("wallet")}
              className={`transition-fx relative px-4 py-3 text-base font-medium transition-colors ${
                activeTab === "wallet"
                  ? "text-brand-main"
                  : "text-brand-ash hover:text-brand-black"
              }`}
            >
              <span className="flex items-center gap-2">
                Wallet History
                <WalletIcon className="h-4 w-4 text-brand-main" />
              </span>
              {activeTab === "wallet" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-main" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("customers")}
              className={`transition-fx relative px-4 py-3 text-base font-medium transition-colors ${
                activeTab === "customers"
                  ? "text-brand-main"
                  : "text-brand-ash hover:text-brand-black"
              }`}
            >
              <span className="flex items-center gap-2">
                Customers
                <UsersIcon className="h-4 w-4 text-brand-main" />
              </span>
              {activeTab === "customers" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-main" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-brand-border-light bg-brand-white p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ash" />
            <input
              type="text"
              placeholder="Search transactions"
              className="w-1/3 rounded-lg border border-brand-border-light bg-brand-light-bg py-2 pl-10 pr-4 text-sm text-brand-black placeholder:text-brand-ash focus:border-brand-main focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusFilterDropdown
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>

          <div className="flex items-center gap-3">
            <DateRangeFilterDropdown
              value={dateFilter}
              onPresetChange={handleDatePresetChange}
              onCustomRangeChange={handleCustomRangeChange}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-brand-border-light bg-brand-white shadow-sm">
          {activeTab === "wallet" ? (
            <TransactionTable
              transactions={filteredWalletTransactions}
              onTransactionClick={setSelectedTransaction}
              onReportIssue={handleReportIssue}
              onShareReceipt={handleShareReceipt}
            />
          ) : (
            <CustomerTransactionTable
              transactions={filteredCustomerTransactions}
              onTransactionClick={setSelectedTransaction}
              onReportIssue={handleReportIssue}
              onShareReceipt={handleShareReceipt}
            />
          )}

          <div className="flex items-center justify-between border-t border-brand-border-light px-6 py-4 text-xs text-brand-ash">
            <span>Page {currentPage} of 5</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="transition-fx inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border-light text-sm hover:border-brand-main hover:text-brand-main disabled:cursor-not-allowed disabled:opacity-50"
              >
                ‹
              </button>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${
                      currentPage === page
                        ? "bg-brand-main text-brand-white"
                        : "border border-brand-border-light hover:border-brand-main hover:text-brand-main"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
                disabled={currentPage === 5}
                className="transition-fx inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border-light text-sm hover:border-brand-main hover:text-brand-main disabled:cursor-not-allowed disabled:opacity-50"
              >
                ›
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span>10/Page</span>
            </div>
          </div>
        </div>
      </section>

      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </>
  );
};

TransactionsPage.getLayout = (page) => (
  <DashboardLayout
    heading="Transactions"
    byText="Monitor and manage partner and customer activities."
  >
    {page}
  </DashboardLayout>
);

export default TransactionsPage;
