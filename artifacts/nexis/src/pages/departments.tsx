import React from "react";
import { useListDepartments, getListDepartmentsQueryKey } from "@workspace/api-client-react";
import { useTenant } from "@/lib/tenant-context";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, AlertTriangle, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Departments() {
  const { currentTenant } = useTenant();
  
  const { data: departments, isLoading } = useListDepartments(currentTenant || "", {
    query: {
      enabled: !!currentTenant,
      queryKey: getListDepartmentsQueryKey(currentTenant || "")
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">Performance and risk metrics by business unit.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments?.map(dept => (
            <Card key={dept.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant={dept.status === 'Healthy' ? 'secondary' : dept.status === 'Warning' ? 'destructive' : 'default'} className={dept.status === 'Warning' ? 'bg-amber-500 hover:bg-amber-600 border-transparent text-white' : dept.status === 'Critical' ? '' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'}>
                    {dept.status}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-xl">{dept.name}</CardTitle>
                <div className="text-sm text-muted-foreground">Head: {dept.head}</div>
              </CardHeader>
              <CardContent className="flex-1 mt-4 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Compliance Rate</span>
                    <span className="font-bold">{dept.complianceRate}%</span>
                  </div>
                  <Progress value={dept.complianceRate} className={`h-2 ${dept.complianceRate < 70 ? '[&>div]:bg-destructive' : dept.complianceRate < 90 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-destructive" />
                    <div>
                      <div className="text-xs text-muted-foreground">High Risk</div>
                      <div className="font-bold">{dept.highRiskCount}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="text-xs text-muted-foreground">Overdue</div>
                      <div className="font-bold">{dept.overdueCount}</div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  {dept.totalControls} Controls • {dept.totalRisks} Risks Managed
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/departments/${dept.id}`}>
                    View Details <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
