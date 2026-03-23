import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Settings, Shield } from "lucide-react";
import AppNav from "@/components/AppNav";
import { currentUser } from "@/lib/mock-data";

const Profile = () => {
  const initials = currentUser.fullName.split(" ").map((n) => n[0]).join("");

  return (
    <div className="min-h-screen bg-background pb-24 md:pt-20">
      <AppNav />
      <div className="mx-auto max-w-lg px-4 pt-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-teal text-2xl font-bold text-primary-foreground shadow-lg">
            {initials}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">{currentUser.fullName}</h1>
          <p className="text-muted-foreground">@{currentUser.username}</p>
        </div>

        {/* Account Info */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" /> Account Settings
          </h2>
          <div>
            <Label>Display Name</Label>
            <Input defaultValue={currentUser.fullName} className="mt-1" />
          </div>
          <div>
            <Label>Username</Label>
            <Input defaultValue={currentUser.username} className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input defaultValue={currentUser.email} type="email" className="mt-1" />
          </div>
          <Button variant="hero" className="w-full mt-2">Save Changes</Button>
        </div>

        {/* Security */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-primary" /> Security
          </h2>
          <Button variant="outline" className="w-full">Change Password</Button>
        </div>

        {/* Sign Out */}
        <div className="mt-6 md:hidden">
          <Link to="/">
            <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
