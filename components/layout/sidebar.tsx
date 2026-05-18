"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Search, LayoutDashboard, Bookmark, User, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Search Topics",
      icon: Search,
      href: "/search",
      active: pathname === "/search",
    },
    {
      label: "Saved Paths",
      icon: Bookmark,
      href: "/saved",
      active: pathname === "/saved",
    },
    {
      label: "Profile",
      icon: User,
      href: "/profile",
      active: pathname === "/profile",
    },
  ];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background border-r shadow-sm relative">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4 text-primary">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            SkillMapAi
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition-all",
                route.active ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.active ? "text-primary" : "text-muted-foreground")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 border-t flex flex-col gap-4">
        {mounted && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">Theme</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        )}
        <div className="flex items-center gap-x-2">
          <UserButton />
          <span className="text-sm font-medium">Account</span>
        </div>
      </div>
    </div>
  );
}
