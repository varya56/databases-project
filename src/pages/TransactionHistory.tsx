import { useState } from "react";
import AppNav from "@/components/AppNav";
import TransactionCard from "@/components/TransactionCard";
import { transactions } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

type Filter = "all" | "completed" | "pending" | "flagged";

const TransactionHistory = () => {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all"
    ? transactions
    : transactions.filter((t) => t.status === filter);

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "flagged", label: "Flagged" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pt-20">
      <AppNav />
      <div className="mx-auto max-w-lg px-4 pt-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Transaction History</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {filters.map(({ value, label }) => (
            <Button
              key={value}
              variant={filter === value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(value)}
              className="shrink-0"
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No transactions found.</p>
          ) : (
            filtered.map((t) => <TransactionCard key={t.id} transaction={t} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
