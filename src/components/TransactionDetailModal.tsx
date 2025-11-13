import * as React from "react";
import { X } from "lucide-react";

import type {
  Transaction,
  TransactionStatus,
} from "@/components/TransactionTable";
import type { CustomerTransaction } from "@/components/CustomerTransactionTable";

const statusClasses: Record<TransactionStatus, string> = {
  Successful: "bg-brand-success-bg text-brand-success-text",
  Pending: "bg-brand-pending-bg text-brand-pending-text",
  Failed: "bg-brand-failed-bg text-brand-failed-text",
};

export type TransactionDetailModalProps = {
  transaction: Transaction | CustomerTransaction | null;
  onClose: () => void;
  highlight?: string;
  primaryAction?: { label: string; variant: "primary" | "danger" };
  secondaryAction?: string;
};

export const TransactionDetailModal = ({
  transaction,
  onClose,
  highlight = "NESCO",
  primaryAction = { label: "Report Issue", variant: "danger" },
  secondaryAction = "Share Receipt",
}: TransactionDetailModalProps) => {
  if (!transaction) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-brand-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 space-y-8 rounded-2xl border border-brand-border-light bg-brand-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium capitalize tracking-wide text-brand-black">
              Transaction Details
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-brand-ash cursor-pointer hover:bg-brand-light-bg hover:text-brand-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-xl bg-brand-main-bg p-4">
          <p className="text-base font-medium text-brand-ash">
            Token Purchase from {highlight}
          </p>
          <p className="mt-1 text-base font-semibold text-brand-black">
            {transaction.amount}
          </p>
          <span
            className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium capitalize ${statusClasses[transaction.status]}`}
          >
            {transaction.status}
          </span>
        </div>

        <dl className="grid gap-3 text-xs text-brand-ash border border-brand-border-light rounded-lg p-4">
          <div className="flex items-center justify-between text-base font-medium text-brand-black">
            <dt>Overview</dt>
          </div>
          <div className="flex items-center justify-between">
            <dt>Transaction ID</dt>
            <dd className="text-brand-black">{transaction.id}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Token</dt>
            <dd className="text-brand-black">{transaction.type}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Amount</dt>
            <dd className="text-brand-black">{transaction.amount}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Fees</dt>
            <dd className="text-brand-black">{transaction.fee}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Net Amount</dt>
            <dd className="text-brand-black">{transaction.net}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Payment Method</dt>
            <dd className="text-brand-black">Bank Transfer</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Date &amp; Time</dt>
            <dd className="text-brand-black">Oct 04, 2025 · 09:42 AM</dd>
          </div>
        </dl>

        <div className="flex gap-3">
          <button
            type="button"
            className={`transition-fx inline-flex flex-1 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium cursor-pointer ${
              primaryAction.variant === "primary"
                ? "bg-brand-main text-brand-white hover:bg-brand-main/90"
                : "bg-brand-failed-bg text-brand-failed-text hover:bg-brand-failed-text/90 hover:text-brand-white"
            }`}
          >
            {primaryAction.label}
          </button>
          <button
            type="button"
            className="transition-fx inline-flex flex-1 items-center justify-center rounded-lg border border-brand-main px-4 py-2 text-sm font-medium text-brand-main cursor-pointer hover:border-brand-main hover:text-brand-white hover:bg-brand-main"
          >
            {secondaryAction}
          </button>
        </div>
      </div>
    </>
  );
};
