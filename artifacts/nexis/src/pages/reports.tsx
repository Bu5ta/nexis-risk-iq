import React, { useState } from "react";
import { useListReports, useGetReport, getListReportsQueryKey, getGetReportQueryKey } from "@workspace/api-client-react";
import { useTenant } from "@/lib/tenant-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Reports() {
  const { currentTenant } = useTenant();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: reports, isLoading } = useListReports(currentTenant || "", {
    query: { enabled: !!currentTenant, queryKey: getListReportsQueryKey(currentTenant || "") }
  });

  const handleGenerate = (id: string) => {
    setSelectedReportId(id);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Pre-configured board packs and risk summaries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48" />)
        ) : reports?.map(report => (
          <Card key={report.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{report.type}</span>
              </div>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-sm flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Period: {report.period}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={() => handleGenerate(report.id)} className="flex-1">Generate</Button>
              <Button variant="outline" size="icon"><Download className="w-4 h-4" /></Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ReportPreviewModal 
        isOpen={isPreviewOpen} 
        setIsOpen={setIsPreviewOpen} 
        reportId={selectedReportId} 
        tenantId={currentTenant || ""} 
      />
    </div>
  );
}

function ReportPreviewModal({ isOpen, setIsOpen, reportId, tenantId }: { isOpen: boolean, setIsOpen: (o: boolean) => void, reportId: string | null, tenantId: string }) {
  const { data: report, isLoading } = useGetReport(tenantId, reportId || "", {
    query: { enabled: !!tenantId && !!reportId && isOpen, queryKey: getGetReportQueryKey(tenantId, reportId || "") }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b shrink-0 bg-muted/30">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl">{report?.title || "Loading Report..."}</DialogTitle>
              <DialogDescription>
                {report ? `Generated on ${format(new Date(report.generatedAt), "MMMM d, yyyy")} • Period: ${report.period}` : "Please wait..."}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" /> Print</Button>
              <Button size="sm"><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-8 bg-card border-x">
          {isLoading || !report ? (
            <div className="space-y-8">
              <Skeleton className="h-12 w-3/4 mx-auto" />
              <div className="space-y-4 max-w-3xl mx-auto">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-64 w-full mt-8" />
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4 pb-8 border-b-2 border-primary/20">
                <h1 className="text-4xl font-serif font-bold text-foreground">{report.title}</h1>
                <p className="text-xl text-muted-foreground font-serif italic">{report.description}</p>
                <div className="text-sm font-semibold uppercase tracking-widest text-primary mt-4">Confidential Board Pack</div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold border-b pb-2">Executive Summary</h2>
                <p className="text-lg leading-relaxed whitespace-pre-wrap">{report.summary}</p>
              </div>

              {report.sections.map((section, idx) => (
                <div key={idx} className="space-y-4 page-break-inside-avoid">
                  <h3 className="text-xl font-bold bg-muted p-2 border-l-4 border-primary">{section.title}</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{section.content}</p>
                  </div>
                  {section.data && (
                    <div className="bg-card border rounded-md p-4 mt-4 font-mono text-sm overflow-auto">
                      <pre>{JSON.stringify(section.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}

              <div className="space-y-4 bg-primary/5 p-6 rounded-lg border border-primary/20">
                <h2 className="text-xl font-bold text-primary">Recommendations</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {report.recommendations.map((rec, i) => (
                    <li key={i} className="text-foreground">{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
