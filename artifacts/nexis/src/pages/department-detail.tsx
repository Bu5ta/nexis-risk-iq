import React from "react";
import { useGetDepartment, getGetDepartmentQueryKey } from "@workspace/api-client-react";

import { useTenant } from "@/lib/tenant-context";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ShieldAlert, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DepartmentDetail() {
  const { currentTenant } = useTenant();
  const params = useParams();
  const deptId = params.id;

  const { data: dept, isLoading } = useGetDepartment(currentTenant || "", deptId || "", {
    query: {
      enabled: !!currentTenant && !!deptId,
      queryKey: getGetDepartmentQueryKey(currentTenant || "", deptId || "")
    }
  });

  if (isLoading || !dept) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-muted-foreground" asChild>
          <Link href="/departments">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Departments
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{dept.name}</h1>
        <p className="text-muted-foreground">Department Head: {dept.head}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dept.complianceRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Items</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{dept.riskBreakdown.find(r => r.level === 'High')?.count || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Controls</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{dept.overdueItems.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Control</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dept.controls.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.control}</TableCell>
                    <TableCell>
                      <Badge variant={c.overallRiskLevel === 'High' ? 'destructive' : c.overallRiskLevel === 'Medium' ? 'secondary' : 'outline'} className={c.overallRiskLevel === 'Medium' ? 'bg-amber-500 text-white' : ''}>
                        {c.overallRiskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {c.implementationStatus}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Accountability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dept.accountability.map(acc => (
                <div key={acc.owner} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <div className="font-medium text-sm">{acc.owner}</div>
                    <div className="text-xs text-muted-foreground">{acc.controlCount} controls</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm ${acc.complianceRate < 80 ? 'text-destructive' : 'text-emerald-500'}`}>
                      {acc.complianceRate}%
                    </div>
                    {acc.overdueCount > 0 && <div className="text-xs text-destructive">{acc.overdueCount} overdue</div>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
