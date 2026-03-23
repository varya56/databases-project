import { Transaction, currentUser } from "@/lib/mock-data";
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react";

interface TransactionCardProps {
  transaction: Transaction;
  showNote?: boolean;
}

const TransactionCard = ({ transaction, showNote = true }: TransactionCardProps) => {
  const isIncoming = transaction.receiverId === currentUser.id;
  const otherPerson = isIncoming
    ? { name: transaction.senderName, username: transaction.senderUsername }
    : { name: transaction.receiverName, username: transaction.receiverUsername };

  const initials = otherPerson.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const formattedDate = new Date(transaction.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-sm border border-border/50 transition-all hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground text-sm">
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-card-foreground truncate">{otherPerson.name}</span>
          <span className="text-xs text-muted-foreground">@{otherPerson.username}</span>
        </div>
        {showNote && transaction.note && (
          <p className="text-sm text-muted-foreground mt-0.5 truncate">{transaction.note}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          {transaction.status === "flagged" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
              <AlertTriangle className="h-3 w-3" /> Flagged
            </span>
          )}
          {transaction.status === "pending" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3 w-3" /> Pending
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {isIncoming ? (
          <ArrowDownLeft className="h-4 w-4 text-success" />
        ) : (
          <ArrowUpRight className="h-4 w-4 text-destructive" />
        )}
        <span className={`font-bold text-sm ${isIncoming ? "text-success" : "text-destructive"}`}>
          {isIncoming ? "+" : "-"}${transaction.amount.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default TransactionCard;
