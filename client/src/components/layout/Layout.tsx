import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Dumbbell, 
  Utensils, 
  Activity, 
  User, 
  Home, 
  Trophy, 
  Menu,
  Users,
  Moon,
  Sun
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLocalStorage, UserProfile, defaultProfile } from "@/lib/storage";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

const NAV_ITEMS = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Workouts", icon: Dumbbell, href: "/workouts" },
  { label: "Meal Plans", icon: Utensils, href: "/meals" },
  { label: "Tracker", icon: Activity, href: "/tracker" },
  { label: "Challenges", icon: Trophy, href: "/challenges" },
  { label: "Community", icon: Users, href: "/community" },
  { label: "Profile", icon: User, href: "/profile" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const NavContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border/50">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Activity className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tighter text-foreground">FITLIFE<span className="text-primary">PRO</span></h1>
          <p className="text-xs text-sidebar-foreground/60 font-medium tracking-wider">OFFLINE EDITION</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer",
                  isActive 
                    ? "bg-primary/10 text-primary border-r-2 border-primary" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-foreground"
                )}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")} />
                <span className="font-medium tracking-wide">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-foreground hover:bg-sidebar-accent px-4"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="font-medium tracking-wide">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar (Nav) */}
      <div className="hidden lg:block w-64 h-full shrink-0">
        <NavContent />
      </div>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-border bg-sidebar flex items-center justify-between px-4 shrink-0 z-20">
          <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">FITLIFE<span className="text-primary">PRO</span></span>
          </div>
          
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80 border-r border-sidebar-border bg-sidebar">
              <NavContent />
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent p-4 md:p-8 pb-24">
          <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
