import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 md:px-12">
        <h1 className="text-xl font-bold text-primary">QuickPay</h1>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="hero-outline" size="sm">Log In</Button>
          </Link>
          <Link to="/register">
            <Button variant="hero" size="sm">Sign Up</Button>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl animate-fade-in">
          <h2 className="text-4xl font-extrabold tracking-tight text-navy-foreground md:text-6xl">
            Send money,{" "}
            <span className="text-primary">instantly.</span>
          </h2>
          <p className="mt-4 text-lg text-navy-foreground/70 md:text-xl">
            Split bills, pay friends, and manage your money — all in one beautifully simple app.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button variant="hero" size="lg" className="gap-2 text-base px-8">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="hero-outline" size="lg" className="text-base px-8">
                I have an account
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {[
            { icon: Zap, title: "Instant Transfers", desc: "Money moves in seconds, not days." },
            { icon: Shield, title: "Bank-Level Security", desc: "Encrypted and protected, always." },
            { icon: Users, title: "Social Payments", desc: "See what friends are paying for." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-navy-foreground/10 bg-navy-foreground/5 p-6 backdrop-blur-sm">
              <Icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-navy-foreground">{title}</h3>
              <p className="mt-1 text-sm text-navy-foreground/60">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-navy-foreground/40">
        © 2026 QuickPay. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
