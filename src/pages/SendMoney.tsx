import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Search } from "lucide-react";
import AppNav from "@/components/AppNav";
import { users, currentUser } from "@/lib/mock-data";
import { toast } from "sonner";

const SendMoney = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const filteredUsers = search.length > 0
    ? users.filter((u) => u.id !== currentUser.id && (u.username.toLowerCase().includes(search.toLowerCase()) || u.fullName.toLowerCase().includes(search.toLowerCase())))
    : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !amount) return;
    setSent(true);
    toast.success(`$${parseFloat(amount).toFixed(2)} sent to @${selectedUser.username}`);
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pt-20">
        <AppNav />
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 pt-32 text-center animate-fade-in">
          <CheckCircle className="h-16 w-16 text-success mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Payment Sent!</h2>
          <p className="mt-2 text-muted-foreground">
            ${parseFloat(amount).toFixed(2)} → @{selectedUser?.username}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pt-20">
      <AppNav />
      <div className="mx-auto max-w-lg px-4 pt-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Send Money</h1>

        <form onSubmit={handleSend} className="space-y-6">
          {/* User Search */}
          <div>
            <Label>Recipient</Label>
            {selectedUser ? (
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-primary/30 bg-accent p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold text-sm">
                  {selectedUser.fullName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{selectedUser.fullName}</p>
                  <p className="text-xs text-muted-foreground">@{selectedUser.username}</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setSelectedUser(null); setSearch(""); }}>
                  Change
                </Button>
              </div>
            ) : (
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by username or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
                {filteredUsers.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-border bg-card shadow-lg">
                    {filteredUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => { setSelectedUser(u); setSearch(""); }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold text-xs">
                          {u.fullName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{u.fullName}</p>
                          <p className="text-xs text-muted-foreground">@{u.username}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount</Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-2xl font-bold h-14"
                required
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder="What's this for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2 resize-none"
              rows={2}
            />
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={!selectedUser || !amount}
          >
            Send ${amount ? parseFloat(amount).toFixed(2) : "0.00"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SendMoney;
