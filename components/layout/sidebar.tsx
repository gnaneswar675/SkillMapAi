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
    <div className="space-y-4 py-4 flex flex-col h-full bg-black/60 backdrop-blur-xl border-r border-white/[0.08] relative">
      <div className="px-3 py-2 flex-1">
        <div className="flex items-center justify-between pl-3 mb-10 pr-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.15)] group-hover:scale-105 transition-transform duration-300">
              <BrainCircuit className="w-5.5 h-5.5 text-indigo-400" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              SkillMapAi
            </h1>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-8 w-8 text-white/40 hover:text-white border border-white/[0.08] hover:bg-white/10 flex rounded-full bg-black/40 backdrop-blur-md transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1.5 px-2">
          {routes.map((route) => (
            <a
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer border transition-all duration-200",
                route.active 
                  ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/15 shadow-[0_0_15px_rgba(99,102,241,0.05)] rounded-xl font-semibold" 
                  : "text-white/40 hover:text-white/90 hover:bg-white/[0.03] hover:border-white/[0.05] border-transparent rounded-xl"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3 transition-colors", route.active ? "text-indigo-400" : "text-white/40 group-hover:text-white/80")} />
                {route.label}
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="px-4 py-4 border-t border-white/[0.08] flex flex-col gap-4">
        <div className="flex items-center gap-x-3 bg-white/[0.02] border border-white/[0.06] p-3 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8 rounded-lg"
              }
            }}
          />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white/80">Account</span>
            <span className="text-[10px] text-white/40">Manage profile settings</span>
          </div>
        </div>
      </div>
    </div>
  );
}

