"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Search, LayoutDashboard, Bookmark, User, ChevronLeft } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useSidebarStore } from "@/lib/store/use-sidebar-store";

export function Sidebar() {
  const pathname = usePathname();
  const { toggle } = useSidebarStore();

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
        <div className="flex items-center justify-between pl-3 mb-14 pr-3">
          <Link href="/" className="flex items-center">
            <div className="relative w-8 h-8 mr-4 text-primary">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              SkillMapAi
            </h1>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-8 w-8 text-muted-foreground hover:text-foreground flex rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1">
          {routes.map((route) => (
            <a
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
            </a>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 border-t flex flex-col gap-4">
        <div className="flex items-center gap-x-2">
          <UserButton />
          <span className="text-sm font-medium">Account</span>
        </div>
      </div>
    </div>
  );
}
