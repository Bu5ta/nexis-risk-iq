import React, { createContext, useContext, useState, useEffect } from "react";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  department: string;
  tenantId: string;
}

interface TenantContextType {
  currentTenant: string | null;
  currentRole: string | null;
  currentUser: CurrentUser | null;
  isDemoMode: boolean;
  isInitialized: boolean;
  setTenant: (tenantId: string) => void;
  setRole: (role: string) => void;
  setUser: (user: CurrentUser | null) => void;
  setDemoMode: (demo: boolean) => void;
  logout: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [currentTenant, setCurrentTenantState] = useState<string | null>(null);
  const [currentRole, setCurrentRoleState] = useState<string | null>(null);
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(null);
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const tenant = localStorage.getItem("nexis_tenant");
    const role = localStorage.getItem("nexis_role");
    const user = loadFromStorage<CurrentUser>("nexis_user");
    const demo = localStorage.getItem("nexis_demo") === "true";
    if (tenant) setCurrentTenantState(tenant);
    if (role) setCurrentRoleState(role);
    if (user) setCurrentUserState(user);
    setIsDemoModeState(demo);
    setIsInitialized(true);
  }, []);

  const setTenant = (tenantId: string) => {
    setCurrentTenantState(tenantId);
    localStorage.setItem("nexis_tenant", tenantId);
  };

  const setRole = (role: string) => {
    setCurrentRoleState(role);
    localStorage.setItem("nexis_role", role);
  };

  const setUser = (user: CurrentUser | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem("nexis_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("nexis_user");
    }
  };

  const setDemoMode = (demo: boolean) => {
    setIsDemoModeState(demo);
    localStorage.setItem("nexis_demo", String(demo));
  };

  const logout = () => {
    setCurrentTenantState(null);
    setCurrentRoleState(null);
    setCurrentUserState(null);
    setIsDemoModeState(false);
    localStorage.removeItem("nexis_tenant");
    localStorage.removeItem("nexis_role");
    localStorage.removeItem("nexis_user");
    localStorage.removeItem("nexis_demo");
  };

  return (
    <TenantContext.Provider value={{
      currentTenant, currentRole, currentUser, isDemoMode, isInitialized,
      setTenant, setRole, setUser, setDemoMode, logout,
    }}>
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
