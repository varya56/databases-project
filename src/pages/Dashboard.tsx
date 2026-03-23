import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Send, TrendingUp, TrendingDown } from "lucide-react";
import AppNav from "@/components/AppNav";
import TransactionCard from "@/components/TransactionCard";
import { currentUser, transactions } from "@/lib/mock-data";

const Dashboard = () => {
  const recentTransactions = transactions.slice(0, 5);
  const totalIncoming = transactions
    .filter((t) => t.receiverId === currentUser.id && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOutgoing = transactions
    .filter((t) => t.senderId === currentUser.id && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background pb-24 md:pt-20">
      <AppNav />
      <div className="mx-auto max-w-lg px-4 pt-6">
        {/* Balance Card */}
        <div className="gradient-navy rounded-2xl p-6 text-center shadow-lg">
          <p className="text-sm font-medium text-navy-foreground/60">Your Balance</p>
          <p className="mt-1 text-4xl font-extrabold text-navy-foreground">
            ${currentUser.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-1 text-success">
              <TrendingUp className="h-4 w-4" /> +${totalIncoming.toFixed(2)}
            </span>
            <span className="flex items-center gap-1 text-destructive">
              <TrendingDown className="h-4 w-4" /> -${totalOutgoing.toFixed(2)}
            </span>
          </div>
          <Link to="/send">
            <Button variant="hero" size="lg" className="mt-6 gap-2">
              <Send className="h-4 w-4" /> Send Money
            </Button>
          </Link>
        </div>

        {/* Feed */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
            <Link to="/history" className="text-sm font-medium text-primary hover:underline">
              See all
            </Link>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((t) => (
              <TransactionCard key={t.id} transaction={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
