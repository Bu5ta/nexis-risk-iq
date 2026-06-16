import React, { useState, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  useListControls,
  getListControlsQueryKey,
  useGetControl,
  getGetControlQueryKey,
  useUpdateControl,
  useAddControlNote,
  usePerformControlAction,
  useCreateControl,
  useImportControls,
  useDeleteControl,
  useListDepartments,
  getListDepartmentsQueryKey,
  type Control,
  type ControlDetail,
  type ControlInput,
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
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Search,
  Download,
  Upload,
  Plus,
  Filter,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  FileSpreadsheet,
} from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

// ─── Badges ─────────────────────────────────────────────────────────────────

const RiskBadge = ({ level }: { level: string }) => {
  switch (level) {
    case "High":   return <Badge variant="destructive">High</Badge>;
    case "Medium": return <Badge className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
    case "Low":    return <Badge className="bg-emerald-500 hover:bg-emerald-600">Low</Badge>;
    default:       return <Badge variant="secondary">{level}</Badge>;
  }
};

const StatusBadge = ({ status, isEscalated }: { status: string; isEscalated?: boolean }) => {
  if (isEscalated) return <Badge variant="destructive" className="bg-orange-600 hover:bg-orange-700">Escalated</Badge>;
  switch (status) {
    case "Implemented":    return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent">Implemented</Badge>;
    case "In Progress":    return <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-transparent">In Progress</Badge>;
    case "Overdue":        return <Badge variant="destructive">Overdue</Badge>;
    case "Awaiting Review":return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-transparent">Awaiting Review</Badge>;
    case "Draft":          return <Badge variant="secondary">Draft</Badge>;
    default:               return <Badge variant="outline">{status}</Badge>;
  }
};

// ─── CSV template columns ─────────────────────────────────────────────────────
const CSV_TEMPLATE_HEADERS = [
  "department","risk","control","controlOwner","implementationDate",
  "overallRiskLevel","implementationStatus","withinAppetite",
  "residualRiskScore","inherentRiskScore","riskDescription","controlDescription",
];

function downloadCsvTemplate() {
  const sample = [
    ["Finance & Procurement","Risk of procurement fraud","Segregation of duties in approval workflow","Director Jane Smith","2025-12-31","High","In Progress","true","14","20","Risk of irregular expenditure","Four-eyes principle on all purchase orders above BWP 50,000"],
  ];
  const csv = [CSV_TEMPLATE_HEADERS.join(","), ...sample.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "controls-import-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Add Control Dialog ───────────────────────────────────────────────────────

function AddControlDialog({
  open,
  onClose,
  tenantId,
  currentRole,
}: {
  open: boolean;
  onClose: () => void;
  tenantId: string;
  currentRole: string;
}) {
  const queryClient = useQueryClient();
  const createMutation = useCreateControl();

  const deptParams = { tenantId };
  const { data: departments } = useListDepartments(tenantId, {
    query: { enabled: open && !!tenantId, queryKey: getListDepartmentsQueryKey(tenantId) },
  });

  const [form, setForm] = useState({
    departmentId: "",
    risk: "",
    control: "",
    controlOwner: "",
    implementationDate: new Date().toISOString().slice(0, 10),
    overallRiskLevel: "Medium",
    implementationStatus: "Draft",
    withinAppetite: true,
    residualRiskScore: "0",
    inherentRiskScore: "0",
    riskDescription: "",
    controlDescription: "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.departmentId || !form.risk || !form.control) {
      toast.error("Department, risk description, and control name are required.");
      return;
    }
    const selectedDept = departments?.find(d => d.id === form.departmentId);
    const payload: ControlInput = {
      tenantId,
      departmentId: form.departmentId,
      department: selectedDept?.name || "",
      risk: form.risk,
      control: form.control,
      controlOwner: form.controlOwner,
      implementationDate: form.implementationDate,
      overallRiskLevel: form.overallRiskLevel as "High" | "Medium" | "Low",
      implementationStatus: form.implementationStatus as any,
      withinAppetite: form.withinAppetite,
      residualRiskScore: Number(form.residualRiskScore),
      inherentRiskScore: Number(form.inherentRiskScore),
      riskDescription: form.riskDescription,
      controlDescription: form.controlDescription,
      actor: currentRole,
    };

    createMutation.mutate({ data: payload }, {
      onSuccess: () => {
        toast.success("Control created successfully.");
        queryClient.invalidateQueries({ queryKey: getListControlsQueryKey({ tenantId }) });
        onClose();
        setForm({
          departmentId: "", risk: "", control: "", controlOwner: "",
          implementationDate: new Date().toISOString().slice(0, 10),
          overallRiskLevel: "Medium", implementationStatus: "Draft", withinAppetite: true,
          residualRiskScore: "0", inherentRiskScore: "0", riskDescription: "", controlDescription: "",
        });
      },
      onError: () => toast.error("Failed to create control. Please try again."),
    });
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Control</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <Label htmlFor="dept">Department *</Label>
              <Select value={form.departmentId} onValueChange={v => setForm(f => ({ ...f, departmentId: v }))}>
                <SelectTrigger id="dept">
                  <SelectValue placeholder="Select department…" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-1">
              <Label htmlFor="risk">Risk Description *</Label>
              <Input id="risk" placeholder="Describe the risk this control addresses…" value={form.risk} onChange={set("risk")} required />
            </div>

            <div className="col-span-2 space-y-1">
              <Label htmlFor="control">Control Name *</Label>
              <Input id="control" placeholder="Name of the control…" value={form.control} onChange={set("control")} required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="owner">Control Owner</Label>
              <Input id="owner" placeholder="e.g. Director Jane Smith" value={form.controlOwner} onChange={set("controlOwner")} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="date">Target Implementation Date</Label>
              <Input id="date" type="date" value={form.implementationDate} onChange={set("implementationDate")} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="riskLevel">Risk Level</Label>
              <Select value={form.overallRiskLevel} onValueChange={v => setForm(f => ({ ...f, overallRiskLevel: v }))}>
                <SelectTrigger id="riskLevel"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <Select value={form.implementationStatus} onValueChange={v => setForm(f => ({ ...f, implementationStatus: v }))}>
                <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Implemented">Implemented</SelectItem>
                  <SelectItem value="Awaiting Review">Awaiting Review</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="residual">Residual Risk Score (0–25)</Label>
              <Input id="residual" type="number" min={0} max={25} value={form.residualRiskScore} onChange={set("residualRiskScore")} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="inherent">Inherent Risk Score (0–25)</Label>
              <Input id="inherent" type="number" min={0} max={25} value={form.inherentRiskScore} onChange={set("inherentRiskScore")} />
            </div>

            <div className="col-span-2 flex items-center gap-3 pt-1">
              <Checkbox
                id="appetite"
                checked={form.withinAppetite}
                onCheckedChange={v => setForm(f => ({ ...f, withinAppetite: !!v }))}
              />
              <Label htmlFor="appetite" className="cursor-pointer">Within Risk Appetite</Label>
            </div>

            <div className="col-span-2 space-y-1">
              <Label htmlFor="riskDesc">Risk Description (detailed)</Label>
              <Textarea id="riskDesc" placeholder="Detailed description of the underlying risk…" rows={2} value={form.riskDescription} onChange={set("riskDescription")} />
            </div>

            <div className="col-span-2 space-y-1">
              <Label htmlFor="ctrlDesc">Control Description (detailed)</Label>
              <Textarea id="ctrlDesc" placeholder="How this control mitigates the risk…" rows={2} value={form.controlDescription} onChange={set("controlDescription")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Saving…" : "Add Control"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Import Dialog ────────────────────────────────────────────────────────────

type ParsedRow = Record<string, string | number | boolean>;

function ImportControlsDialog({
  open,
  onClose,
  tenantId,
  currentRole,
}: {
  open: boolean;
  onClose: () => void;
  tenantId: string;
  currentRole: string;
}) {
  const queryClient = useQueryClient();
  const importMutation = useImportControls();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ inserted: number; errors: Array<{ row: number; error: string }> } | null>(null);

  const resetState = () => {
    setParsedRows([]);
    setParseError(null);
    setFileName(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setParsedRows([]);
    setParseError(null);
    setImportResult(null);

    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse<ParsedRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: result => {
          if (result.errors.length > 0) {
            setParseError(`CSV parse error: ${result.errors[0].message}`);
          } else {
            setParsedRows(result.data);
          }
        },
        error: err => setParseError(err.message),
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = ev.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json<ParsedRow>(worksheet);
          setParsedRows(rows);
        } catch (err) {
          setParseError(`Excel parse error: ${String(err)}`);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      setParseError("Unsupported file format. Please upload a CSV (.csv) or Excel (.xlsx, .xls) file.");
    }
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;
    importMutation.mutate(
      {
        tenantId,
        data: {
          rows: parsedRows as any,
          actor: currentRole,
          actorRole: currentRole,
        },
      },
      {
        onSuccess: result => {
          setImportResult(result);
          queryClient.invalidateQueries({ queryKey: getListControlsQueryKey({ tenantId }) });
          if (result.inserted > 0) {
            toast.success(`${result.inserted} control${result.inserted !== 1 ? "s" : ""} imported successfully.`);
          }
          if (result.errors.length > 0) {
            toast.warning(`${result.errors.length} row${result.errors.length !== 1 ? "s" : ""} had errors.`);
          }
        },
        onError: () => toast.error("Import failed. Please check your file and try again."),
      }
    );
  };

  const previewCols = parsedRows.length > 0 ? Object.keys(parsedRows[0]).slice(0, 6) : [];

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Import Controls from Spreadsheet
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 mt-2">
          {!importResult ? (
            <>
              {/* Instructions */}
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                <p className="font-medium">How to import:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Download the template below and fill in your controls data.</li>
                  <li>Upload your completed CSV or Excel file.</li>
                  <li>Review the preview, then click "Confirm Import".</li>
                </ol>
                <Button variant="outline" size="sm" className="mt-2 gap-2" onClick={downloadCsvTemplate}>
                  <Download className="w-3 h-3" /> Download CSV Template
                </Button>
              </div>

              {/* File input */}
              <div className="space-y-2">
                <Label>Upload File</Label>
                <div className="flex gap-3 items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileChange}
                    id="import-file-input"
                  />
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </Button>
                  {fileName && (
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      {fileName}
                    </span>
                  )}
                </div>
                {parseError && (
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {parseError}
                  </p>
                )}
              </div>

              {/* Preview */}
              {parsedRows.length > 0 && (
                <div className="flex-1 overflow-hidden flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    Found <strong>{parsedRows.length}</strong> row{parsedRows.length !== 1 ? "s" : ""} — previewing first 5:
                  </p>
                  <div className="overflow-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {previewCols.map(col => (
                            <TableHead key={col} className="text-xs whitespace-nowrap">{col}</TableHead>
                          ))}
                          {Object.keys(parsedRows[0]).length > 6 && (
                            <TableHead className="text-xs text-muted-foreground">+{Object.keys(parsedRows[0]).length - 6} more</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedRows.slice(0, 5).map((row, i) => (
                          <TableRow key={i}>
                            {previewCols.map(col => (
                              <TableCell key={col} className="text-xs max-w-[150px] truncate">
                                {String(row[col] ?? "")}
                              </TableCell>
                            ))}
                            {Object.keys(row).length > 6 && <TableCell />}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Results view */
            <div className="space-y-4">
              <div className={`rounded-lg p-4 ${importResult.inserted > 0 ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-muted/50"}`}>
                <p className="font-semibold text-lg">
                  {importResult.inserted > 0 ? (
                    <span className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-5 h-5" />
                      {importResult.inserted} control{importResult.inserted !== 1 ? "s" : ""} imported successfully
                    </span>
                  ) : (
                    "No controls were imported."
                  )}
                </p>
              </div>
              {importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-destructive">
                    {importResult.errors.length} row{importResult.errors.length !== 1 ? "s" : ""} had errors:
                  </p>
                  <div className="border rounded-md overflow-auto max-h-40">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Error</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importResult.errors.map((err, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono text-xs">{err.row}</TableCell>
                            <TableCell className="text-xs text-destructive">{err.error}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 border-t pt-4">
          {!importResult ? (
            <>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button
                onClick={handleConfirmImport}
                disabled={parsedRows.length === 0 || importMutation.isPending}
                className="gap-2"
              >
                {importMutation.isPending ? (
                  "Importing…"
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Confirm Import ({parsedRows.length} rows)
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={resetState}>Import Another File</Button>
              <Button onClick={handleClose}>Done</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Register Page ───────────────────────────────────────────────────────

export default function Register() {
  const { currentTenant, currentRole } = useTenant();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const controlsParams = {
    tenantId: currentTenant || "",
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    riskLevel: riskFilter !== "all" ? riskFilter : undefined,
  };

  const { data: controls, isLoading } = useListControls(controlsParams, {
    query: {
      enabled: !!currentTenant,
      queryKey: getListControlsQueryKey(controlsParams),
    },
  });

  const { data: controlDetail, isLoading: isDetailLoading } = useGetControl(
    selectedControlId || "",
    {
      query: {
        enabled: !!selectedControlId,
        queryKey: getGetControlQueryKey(selectedControlId || ""),
      },
    }
  );

  const handleRowClick = (id: string) => {
    setSelectedControlId(id);
    setIsDrawerOpen(true);
  };

  const handleExport = () => {
    window.location.href = `/api/tenants/${currentTenant}/controls/export`;
  };

  const canEdit = [
    "Manager - Risk and Compliance",
    "Risk Champion",
    "Director / Head of Department",
    "Risk Owner",
  ].includes(currentRole || "");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk & Control Register</h1>
          <p className="text-muted-foreground">
            {controls ? `${controls.length} controls` : "All controls"} across departments.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          {canEdit && (
            <>
              <Button variant="outline" className="gap-2" onClick={() => setIsImportOpen(true)}>
                <Upload className="w-4 h-4" />
                Import
              </Button>
              <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
                <Plus className="w-4 h-4" />
                Add Control
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search controls or risks..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
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
              <TableHead>Ref</TableHead>
              <TableHead className="max-w-[300px]">Control</TableHead>
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
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : controls?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                  No controls found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              controls?.map(control => (
                <TableRow
                  key={control.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(control.id)}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">{control.id.split("-").slice(0, 3).join("-")}</TableCell>
                  <TableCell className="font-medium max-w-[300px] truncate" title={control.control}>
                    {control.control}
                  </TableCell>
                  <TableCell className="text-sm">{control.department}</TableCell>
                  <TableCell className="text-sm">{control.controlOwner}</TableCell>
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

      {/* Dialogs */}
      <AddControlDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        tenantId={currentTenant || ""}
        currentRole={currentRole || ""}
      />
      <ImportControlsDialog
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        tenantId={currentTenant || ""}
        currentRole={currentRole || ""}
      />
      <ControlDetailDrawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        control={controlDetail}
        isLoading={isDetailLoading}
        tenantId={currentTenant || ""}
        role={currentRole || ""}
        canEdit={canEdit}
      />
    </div>
  );
}

// ─── Control Detail Drawer ────────────────────────────────────────────────────

function ControlDetailDrawer({
  isOpen,
  setIsOpen,
  control,
  isLoading,
  tenantId,
  role,
  canEdit,
}: {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  control?: ControlDetail;
  isLoading: boolean;
  tenantId: string;
  role: string;
  canEdit: boolean;
}) {
  const queryClient = useQueryClient();
  const actionMutation = usePerformControlAction();
  const noteMutation = useAddControlNote();
  const deleteMutation = useDeleteControl();
  const [noteContent, setNoteContent] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListControlsQueryKey({ tenantId }) });
    if (control) queryClient.invalidateQueries({ queryKey: getGetControlQueryKey(control.id) });
  };

  const handleAction = (actionType: "mark_complete" | "escalate" | "assign_owner" | "mark_reviewed" | "mark_in_progress" | "revert_to_draft") => {
    if (!control) return;
    actionMutation.mutate(
      { controlId: control.id, data: { action: actionType, actor: role } },
      {
        onSuccess: () => {
          toast.success(`Action completed.`);
          invalidate();
          setIsOpen(false);
        },
        onError: () => toast.error("Failed to perform action."),
      }
    );
  };

  const handleAddNote = () => {
    if (!control || !noteContent.trim()) return;
    noteMutation.mutate(
      { controlId: control.id, data: { content: noteContent, author: role } },
      {
        onSuccess: () => {
          toast.success("Note added.");
          setNoteContent("");
          invalidate();
        },
        onError: () => toast.error("Failed to add note."),
      }
    );
  };

  const handleDelete = () => {
    if (!control) return;
    deleteMutation.mutate(
      { controlId: control.id },
      {
        onSuccess: () => {
          toast.success("Control deleted.");
          queryClient.invalidateQueries({ queryKey: getListControlsQueryKey({ tenantId }) });
          setIsOpen(false);
        },
        onError: () => toast.error("Failed to delete control."),
      }
    );
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
              <DrawerHeader className="border-b shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">{control.id}</span>
                      <StatusBadge status={control.implementationStatus} isEscalated={control.isEscalated} />
                      <RiskBadge level={control.overallRiskLevel} />
                      {!control.withinAppetite && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Appetite Breach
                        </Badge>
                      )}
                    </div>
                    <DrawerTitle className="text-xl leading-tight">{control.control}</DrawerTitle>
                    <DrawerDescription className="mt-1">{control.department} • {control.controlOwner}</DrawerDescription>
                  </div>
                  {canEdit && (
                    <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleAction("mark_in_progress")}>In Progress</Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1" onClick={() => handleAction("mark_complete")}>
                        <CheckCircle2 className="w-4 h-4" /> Complete
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="gap-1">
                            <AlertTriangle className="w-4 h-4" /> Escalate
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Escalate this control?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will escalate the control to the executive board and notify the department head immediately.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleAction("escalate")} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Yes, Escalate
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive gap-1">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this control?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The control and all associated notes and timeline will be permanently deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
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
                          <p className="text-sm">{control.controlDescription || "—"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Target Date</h4>
                          <p className="text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {control.implementationDate ? format(new Date(control.implementationDate), "MMMM d, yyyy") : "—"}
                          </p>
                        </div>
                        {control.lastReviewed && (
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Reviewed</h4>
                            <p className="text-sm">{format(new Date(control.lastReviewed), "MMMM d, yyyy HH:mm")}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Risk Context</h3>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Associated Risk</h4>
                          <p className="text-sm font-medium">{control.risk}</p>
                          <p className="text-sm text-muted-foreground mt-1">{control.riskDescription || "—"}</p>
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
                    {control.timeline.length === 0 ? (
                      <div className="text-center p-8 text-muted-foreground text-sm border border-dashed rounded-lg">
                        No timeline entries yet.
                      </div>
                    ) : (
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
                    )}
                  </TabsContent>

                  <TabsContent value="notes" className="mt-6 space-y-6">
                    <div className="space-y-4">
                      {control.notes.map(note => (
                        <div key={note.id} className="bg-muted/30 p-4 rounded-lg border">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">{note.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(note.createdAt), "MMM d, HH:mm")}
                            </span>
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
                    {canEdit && (
                      <div className="flex flex-col gap-3 pt-4 border-t">
                        <Textarea
                          placeholder="Add a note or comment..."
                          value={noteContent}
                          onChange={e => setNoteContent(e.target.value)}
                        />
                        <Button
                          onClick={handleAddNote}
                          className="self-end gap-2"
                          disabled={noteMutation.isPending || !noteContent.trim()}
                        >
                          <MessageSquare className="w-4 h-4" /> Add Note
                        </Button>
                      </div>
                    )}
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
