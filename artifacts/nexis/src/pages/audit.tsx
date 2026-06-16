import React, { useState } from "react";
import { useListAuditLog, getListAuditLogQueryKey } from "@workspace/api-client-react";
import { useTenant } from "@/lib/tenant-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Search, Filter, History } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Audit() {
  const { currentTenant } = useTenant();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const auditParams = {
    tenantId: currentTenant || "",
    action: actionFilter !== "all" ? actionFilter : undefined,
    actor: search || undefined
  };
  const { data: auditPage, isLoading } = useListAuditLog(auditParams, {
    query: { enabled: !!currentTenant, queryKey: getListAuditLogQueryKey(auditParams) }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
        <p className="text-muted-foreground">Immutable log of all critical system actions.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by actor name..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="mark_complete">Mark Complete</SelectItem>
            <SelectItem value="escalate">Escalate</SelectItem>
            <SelectItem value="assign_owner">Assign Owner</SelectItem>
            <SelectItem value="add_note">Add Note</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Item Ref</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                </TableRow>
              ))
            ) : auditPage?.entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No audit logs found.
                </TableCell>
              </TableRow>
            ) : (
              auditPage?.entries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(entry.timestamp), "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{entry.actor}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{entry.actorRole}</div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{entry.action}</code>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-primary">{entry.itemId}</TableCell>
                  <TableCell>
                    <Badge variant={entry.result === 'Success' ? 'secondary' : 'destructive'} className={entry.result === 'Success' ? 'bg-emerald-500/10 text-emerald-500' : ''}>
                      {entry.result}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm truncate max-w-[200px]" title={entry.details || ""}>
                    {entry.details || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>Showing {auditPage?.entries.length || 0} of {auditPage?.total || 0} results</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
