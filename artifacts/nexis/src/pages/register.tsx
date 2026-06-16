import React, { useState } from "react";
import { 
  useListControls, 
  getListControlsQueryKey,
  useGetControl,
  getGetControlQueryKey,
  useUpdateControl,
  useAddControlNote,
  usePerformControlAction,
  Control,
  ControlDetail
} from "@workspace/api-client-react";
import { useTenant } from "@/lib/tenant-context";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription 
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Search, Download, Filter, MessageSquare, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RiskBadge = ({ level }: { level: string }) => {
  switch (level) {
    case 'High': return <Badge variant="destructive">High</Badge>;
    case 'Medium': return <Badge className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
    case 'Low': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Low</Badge>;
    default: return <Badge variant="secondary">{level}</Badge>;
  }
};

const StatusBadge = ({ status, isEscalated }: { status: string, isEscalated?: boolean }) => {
  if (isEscalated) return <Badge variant="destructive" className="bg-orange-600 hover:bg-orange-700">Escalated</Badge>;
  
  switch (status) {
    case 'Implemented': return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent">Implemented</Badge>;
    case 'In Progress': return <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-transparent">In Progress</Badge>;
    case 'Overdue': return <Badge variant="destructive">Overdue</Badge>;
    case 'Awaiting Review': return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-transparent">Awaiting Review</Badge>;
    case 'Draft': return <Badge variant="secondary">Draft</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

export default function Register() {
  const { currentTenant, currentRole } = useTenant();
  const queryClient = useQueryClient();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const controlsParams = {
    tenantId: currentTenant || "",
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    riskLevel: riskFilter !== "all" ? riskFilter : undefined
  };
  const { data: controls, isLoading } = useListControls(controlsParams, {
    query: {
      enabled: !!currentTenant,
      queryKey: getListControlsQueryKey(controlsParams)
    }
  });

  const { data: controlDetail, isLoading: isDetailLoading } = useGetControl(selectedControlId || "", {
    query: {
      enabled: !!selectedControlId,
      queryKey: getGetControlQueryKey(selectedControlId || "")
    }
  });

  const handleRowClick = (id: string) => {
    setSelectedControlId(id);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk & Control Register</h1>
          <p className="text-muted-foreground">Comprehensive view of all controls across departments.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search controls or risks..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Implemented">Implemented</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Awaiting Review">Awaiting Review</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Control Ref</TableHead>
              <TableHead className="max-w-[300px]">Description</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Appetite</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : controls?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                  No controls found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              controls?.map((control) => (
                <TableRow 
                  key={control.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(control.id)}
                >
                  <TableCell className="font-mono text-xs">{control.id.split('-')[0]}</TableCell>
                  <TableCell className="font-medium max-w-[300px] truncate" title={control.control}>
                    {control.control}
                  </TableCell>
                  <TableCell>{control.department}</TableCell>
                  <TableCell>{control.controlOwner}</TableCell>
                  <TableCell><RiskBadge level={control.overallRiskLevel} /></TableCell>
                  <TableCell><StatusBadge status={control.implementationStatus} isEscalated={control.isEscalated} /></TableCell>
                  <TableCell>
                    {control.withinAppetite ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Within</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Breach</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ControlDetailDrawer 
        isOpen={isDrawerOpen} 
        setIsOpen={setIsDrawerOpen} 
        control={controlDetail} 
        isLoading={isDetailLoading} 
        tenantId={currentTenant || ""}
        role={currentRole || ""}
      />
    </div>
  );
}

function ControlDetailDrawer({ 
  isOpen, 
  setIsOpen, 
  control, 
  isLoading,
  tenantId,
  role
}: { 
  isOpen: boolean, 
  setIsOpen: (o: boolean) => void, 
  control?: ControlDetail, 
  isLoading: boolean,
  tenantId: string,
  role: string
}) {
  const queryClient = useQueryClient();
  const actionMutation = usePerformControlAction();
  const noteMutation = useAddControlNote();
  const [noteContent, setNoteContent] = useState("");

  const handleAction = (actionType: 'mark_complete'|'escalate'|'assign_owner'|'mark_reviewed'|'mark_in_progress'|'revert_to_draft') => {
    if (!control) return;
    actionMutation.mutate({
      controlId: control.id,
      data: {
        action: actionType,
        actor: role
      }
    }, {
      onSuccess: () => {
        toast.success(`Action ${actionType} completed`);
        queryClient.invalidateQueries({ queryKey: getListControlsQueryKey({ tenantId }) });
        setIsOpen(false);
      },
      onError: (err) => {
        toast.error("Failed to perform action");
      }
    });
  };

  const handleAddNote = () => {
    if (!control || !noteContent.trim()) return;
    noteMutation.mutate({
      controlId: control.id,
      data: {
        content: noteContent,
        author: role
      }
    }, {
      onSuccess: () => {
        toast.success("Note added");
        setNoteContent("");
        queryClient.invalidateQueries({ queryKey: getListControlsQueryKey({ tenantId }) });
      }
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="h-[90vh]">
        <div className="mx-auto w-full max-w-5xl h-full flex flex-col">
          {isLoading || !control ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            </div>
          ) : (
            <>
              <DrawerHeader className="border-b shrink-0 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-muted-foreground">{control.id}</span>
                    <StatusBadge status={control.implementationStatus} isEscalated={control.isEscalated} />
                    <RiskBadge level={control.overallRiskLevel} />
                    {!control.withinAppetite && (
                      <Badge variant="destructive" className="ml-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Appetite Breach
                      </Badge>
                    )}
                  </div>
                  <DrawerTitle className="text-2xl">{control.control}</DrawerTitle>
                  <DrawerDescription className="mt-2 text-base">{control.department} • Owner: {control.controlOwner}</DrawerDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleAction('mark_in_progress')}>In Progress</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction('mark_complete')}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Complete
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <AlertTriangle className="w-4 h-4 mr-2" /> Escalate
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will escalate the control to the executive board and notify the department head immediately.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleAction('escalate')} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Yes, Escalate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </DrawerHeader>
              
              <div className="flex-1 overflow-y-auto p-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-[400px] grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="notes">Notes ({control.notes.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-6 mt-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Control Details</h3>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                          <p className="text-sm">{control.controlDescription}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Target Date</h4>
                          <p className="text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {format(new Date(control.implementationDate), "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Risk Context</h3>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Associated Risk</h4>
                          <p className="text-sm font-medium">{control.risk}</p>
                          <p className="text-sm text-muted-foreground mt-1">{control.riskDescription}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="bg-muted/50 p-3 rounded-md">
                            <div className="text-xs text-muted-foreground mb-1">Inherent Score</div>
                            <div className="font-bold text-xl">{control.inherentRiskScore}</div>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-md">
                            <div className="text-xs text-muted-foreground mb-1">Residual Score</div>
                            <div className="font-bold text-xl">{control.residualRiskScore}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-6">
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                      {control.timeline.map((entry, idx) => (
                        <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-primary group-[.is-active]:text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            {idx === 0 ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border shadow-sm bg-card">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm">{entry.action}</span>
                              <span className="text-xs text-muted-foreground">{format(new Date(entry.timestamp), "MMM d, HH:mm")}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">{entry.actor}</div>
                            {entry.description && <div className="text-sm border-t pt-2 mt-2">{entry.description}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-6 space-y-6">
                    <div className="space-y-4">
                      {control.notes.map(note => (
                        <div key={note.id} className="bg-muted/30 p-4 rounded-lg border">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">{note.author}</span>
                            <span className="text-xs text-muted-foreground">{format(new Date(note.createdAt), "MMM d, HH:mm")}</span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      ))}
                      {control.notes.length === 0 && (
                        <div className="text-center p-8 text-muted-foreground text-sm border border-dashed rounded-lg">
                          No notes added yet.
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-4 border-t">
                      <Textarea 
                        placeholder="Add a note or comment..." 
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                      />
                      <Button onClick={handleAddNote} className="self-end" disabled={noteMutation.isPending || !noteContent.trim()}>
                        <MessageSquare className="w-4 h-4 mr-2" /> Add Note
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
