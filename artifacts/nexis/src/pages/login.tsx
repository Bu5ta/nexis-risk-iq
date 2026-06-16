import React from "react";
import { useLocation } from "wouter";
import { useListTenants } from "@workspace/api-client-react";
import { useTenant } from "@/lib/tenant-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Building2, User, UserCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const BASE = import.meta.env.BASE_URL;

export default function Login() {
  const [, setLocation] = useLocation();
  const { setTenant, setRole } = useTenant();
  const { data: tenants, isLoading } = useListTenants();

  const handleLogin = (tenantId: string, role: string) => {
    setTenant(tenantId);
    setRole(role);
    setLocation("/dashboard");
  };

  const roles = [
    { id: "Super Admin", icon: Shield, desc: "Full system access" },
    { id: "Risk Manager", icon: UserCheck, desc: "Manage risks and controls" },
    { id: "Executive Viewer", icon: User, desc: "Read-only dashboard access" },
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          {/* NEXIS logo */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src={`${BASE}images/nexis-icon.svg`}
              alt="NEXIS"
              className="w-14 h-14 drop-shadow-[0_0_12px_rgba(0,212,255,0.5)]"
            />
            <div className="flex flex-col items-start">
              <span className="text-3xl font-bold tracking-tight leading-tight">NEXIS</span>
              <span className="text-xl font-light text-primary leading-tight">Risk-IQ</span>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">Select a demo workspace to enter</p>

          {/* Partnership strip */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">In Partnership With</span>
            <div className="bg-white rounded-xl overflow-hidden shadow-md flex items-center justify-center" style={{ width: 72, height: 72 }}>
              <img
                src={`${BASE}images/riskinteg-brochure.jpg`}
                alt="RiskInteg Solution Services"
                style={{ width: 68, height: 68, objectFit: 'contain' }}
              />
            </div>
            <span className="text-base font-semibold text-foreground">RiskInteg Solution Services</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tenants?.map((tenant) => (
              <Card key={tenant.id} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    {tenant.name}
                  </CardTitle>
                  <CardDescription>{tenant.sector}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    {tenant.description}
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Login As</div>
                    {roles.map((role) => (
                      <Button 
                        key={role.id} 
                        variant="outline" 
                        className="w-full justify-start h-auto py-3"
                        onClick={() => handleLogin(tenant.id, role.id)}
                      >
                        <role.icon className="w-4 h-4 mr-3 text-muted-foreground" />
                        <div className="flex flex-col items-start text-left">
                          <span className="text-sm font-medium">{role.id}</span>
                          <span className="text-xs text-muted-foreground">{role.desc}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
