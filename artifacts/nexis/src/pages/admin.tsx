import React from "react";
import { useListUsers, useListTenants, getListUsersQueryKey } from "@workspace/api-client-react";
import { useTenant } from "@/lib/tenant-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Users, Building, Bell } from "lucide-react";

export default function Admin() {
  const { currentTenant } = useTenant();
  
  const { data: users } = useListUsers(currentTenant || "", {
    query: { enabled: !!currentTenant, queryKey: getListUsersQueryKey(currentTenant || "") }
  });

  const { data: tenants } = useListTenants();
  const activeTenant = tenants?.find(t => t.id === currentTenant);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
        <p className="text-muted-foreground">System configuration and user management.</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="gap-2"><Users className="w-4 h-4" /> Users & Roles</TabsTrigger>
          <TabsTrigger value="tenant" className="gap-2"><Building className="w-4 h-4" /> Tenant Settings</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage access and roles for your organization.</CardDescription>
              </div>
              <Button>Add User</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{user.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenant">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Configuration</CardTitle>
              <CardDescription>Global settings for {activeTenant?.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-2xl">
              <div className="grid gap-2">
                <Label>Organization Name</Label>
                <Input defaultValue={activeTenant?.name} />
              </div>
              <div className="grid gap-2">
                <Label>Sector</Label>
                <Input defaultValue={activeTenant?.sector} />
              </div>
              <div className="grid gap-2">
                <Label>Risk Appetite Threshold</Label>
                <div className="flex gap-4">
                  <Input type="number" defaultValue="8" className="w-24" />
                  <span className="text-sm text-muted-foreground self-center">Any residual score above this triggers a breach.</span>
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Alert Preferences</CardTitle>
              <CardDescription>Configure when and how alerts are dispatched.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="font-medium">Escalation Alerts</div>
                    <div className="text-sm text-muted-foreground">Notify department heads when a control is escalated.</div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="font-medium">Appetite Breach Report</div>
                    <div className="text-sm text-muted-foreground">Weekly digest of all controls operating outside risk appetite.</div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <div className="font-medium">Overdue Reminders</div>
                    <div className="text-sm text-muted-foreground">Automated chasing for past-due control implementations.</div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
