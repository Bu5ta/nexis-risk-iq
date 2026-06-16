import React from "react";
import { Link, useLocation } from "wouter";
import { useTenant } from "@/lib/tenant-context";
import { useListTenants } from "@workspace/api-client-react";
import { LayoutDashboard, Database, Building2, FileText, History, Settings, Moon, Sun, Monitor, LogOut, Brain } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const BASE = import.meta.env.BASE_URL;

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Risk Register", url: "/register", icon: Database },
  { title: "Departments", url: "/departments", icon: Building2 },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Audit Trail", url: "/audit", icon: History },
  { title: "RiskSight AI", url: "/risksight", icon: Brain },
  { title: "Admin", url: "/admin", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { currentTenant, currentRole, currentUser, isDemoMode, logout, setTenant } = useTenant();
  const { theme, setTheme } = useTheme();
  
  const { data: tenants } = useListTenants();
  
  const activeTenant = tenants?.find((t) => t.id === currentTenant);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!currentTenant || !currentRole) {
      if (location !== "/login") {
        setLocation("/login");
      }
    }
  }, [currentTenant, currentRole, location, setLocation]);

  if (location === "/login") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-[100dvh] w-full">
        <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-4 flex flex-row items-center gap-2">
            <img
              src={`${BASE}images/nexis-icon.svg`}
              alt="NEXIS"
              className="w-9 h-9 shrink-0 drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight">NEXIS</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Risk-IQ</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location.startsWith(item.url)}>
                        <Link href={item.url} className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Partnership footer */}
          <div className="p-3 border-t border-sidebar-border mt-auto">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2 text-center font-medium">
              In Partnership With
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-white rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm" style={{ width: 48, height: 48 }}>
                <img
                  src={`${BASE}images/riskinteg-brochure.jpg`}
                  alt="RiskInteg Solution Services"
                  style={{ width: 44, height: 44, objectFit: 'contain' }}
                />
              </div>
              <span className="text-[11px] font-semibold text-sidebar-foreground leading-tight">RiskInteg<br/>Solution Services</span>
            </div>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              {activeTenant && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9 gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{activeTenant.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[240px]">
                    <DropdownMenuLabel>Switch Tenant</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {tenants?.map((t) => (
                      <DropdownMenuItem 
                        key={t.id} 
                        onClick={() => setTenant(t.id)}
                        className={t.id === currentTenant ? "bg-primary/10 font-medium" : ""}
                      >
                        {t.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" /> Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" /> Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" /> System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-8 w-px bg-border mx-2" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 gap-2 pl-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {currentUser
                          ? currentUser.name.split(" ").map(p => p[0]).slice(0, 2).join("")
                          : "D"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium leading-none">
                        {currentUser ? currentUser.name.split(" ").slice(0, 2).join(" ") : "Demo User"}
                        {isDemoMode && <span className="ml-1.5 text-[9px] font-normal bg-amber-500/20 text-amber-400 px-1 py-0.5 rounded">DEMO</span>}
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-none mt-1">{currentRole}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {currentUser ? currentUser.name : "Demo Session"}
                    {currentUser && <div className="text-xs font-normal text-muted-foreground">{currentUser.email}</div>}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { logout(); setLocation("/login"); }}>
                    <LogOut className="mr-2 h-4 w-4" /> {isDemoMode ? "Exit Demo" : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8 overflow-auto bg-background">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
