import { Link, useLocation } from "react-router-dom";
import { Home, Send, History, User, LogOut } from "lucide-react";

const AppNav = () => {
  const location = useLocation();

  const links = [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/send", icon: Send, label: "Send" },
    { to: "/history", icon: History, label: "History" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg md:top-0 md:bottom-auto">
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2 md:max-w-4xl md:justify-between md:py-3">
        <Link to="/dashboard" className="hidden md:block font-bold text-lg text-primary">
          QuickPay
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          {links.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-colors md:flex-row md:gap-2 md:px-4 md:py-2 md:text-sm ${
                  isActive
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
        <Link
          to="/"
          className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </Link>
      </div>
    </nav>
  );
};

export default AppNav;
