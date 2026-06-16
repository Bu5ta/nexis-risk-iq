import React, { createContext, useContext, useState, useEffect } from "react";

interface TenantContextType {
  currentTenant: string | null;
  currentRole: string | null;
  setTenant: (tenantId: string) => void;
  setRole: (role: string) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [currentTenant, setCurrentTenantState] = useState<string | null>(null);
  const [currentRole, setCurrentRoleState] = useState<string | null>(null);

  useEffect(() => {
    const tenant = localStorage.getItem("nexis_tenant");
    const role = localStorage.getItem("nexis_role");
    if (tenant) setCurrentTenantState(tenant);
    if (role) setCurrentRoleState(role);
  }, []);

  const setTenant = (tenantId: string) => {
    setCurrentTenantState(tenantId);
    localStorage.setItem("nexis_tenant", tenantId);
  };

  const setRole = (role: string) => {
    setCurrentRoleState(role);
    localStorage.setItem("nexis_role", role);
  };

  return (
    <TenantContext.Provider value={{ currentTenant, currentRole, setTenant, setRole }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
