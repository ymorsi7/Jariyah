import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, DollarSign, Calculator } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border">
        <div className="flex h-14 items-center border-b border-border px-4">
          <h1 className="text-lg font-semibold">Jariyah</h1>
        </div>
        <nav className="space-y-1 p-4">
          <NavButton href="/" icon={<Home className="h-4 w-4" />} isActive={location === "/"}>
            Home
          </NavButton>
          <NavButton href="/portfolio" icon={<Calculator className="h-4 w-4" />} isActive={location === "/portfolio"}>
            Portfolio
          </NavButton>
          <NavButton href="/charities" icon={<DollarSign className="h-4 w-4" />} isActive={location === "/charities" || location.startsWith("/charity/")}>
            Charities
          </NavButton>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-background">
        <div className="container mx-auto py-8 px-4">
          {children}
        </div>
      </main>
    </div>
  );
}

interface NavButtonProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  isActive: boolean;
}

function NavButton({ href, icon, children, isActive }: NavButtonProps) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        {icon}
        {children}
      </Button>
    </Link>
  );
}