"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useSidebarStore } from "@/lib/store/use-sidebar-store";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, toggle } = useSidebarStore();

  return (
    <div className="h-full relative flex overflow-hidden">
      {/* Mobile Sidebar Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={toggle} 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[75] md:hidden transition-opacity duration-300 animate-in fade-in"
        />
      )}

      {/* Sidebar Wrapper */}
      <div 
        className={`h-full fixed inset-y-0 left-0 z-[80] w-72 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div 
        className={`flex-1 h-full min-h-screen flex flex-col transition-all duration-300 ease-in-out relative ${
          isOpen ? "md:pl-72" : "pl-0"
        }`}
      >
        {/* Toggle Button Container for opening the menu */}
        {!isOpen && (
          <div className="fixed top-4 left-4 z-[90]">
            <Button
              variant="outline"
              size="icon"
              onClick={toggle}
              className="bg-background border shadow-md hover:bg-muted rounded-full"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="flex-1 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
