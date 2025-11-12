import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Quotation } from "@/types/quotation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuotationTableProps {
  quotations: Quotation[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const QuotationTable = ({
  quotations,
  currentPage,
  itemsPerPage,
  onPageChange,
}: QuotationTableProps) => {
  const totalPages = Math.ceil(quotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuotations = quotations.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "invoiced") {
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    } else if (statusLower === "regret") {
      return <Badge variant="destructive">{status}</Badge>;
    } else if (statusLower === "pending") {
      return <Badge variant="secondary">{status}</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount.replace(/,/g, ""));
    return isNaN(numAmount) ? amount : numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Quotation No</TableHead>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="w-[80px]">Type</TableHead>
              <TableHead>Description 1</TableHead>
              <TableHead>Description 2</TableHead>
              <TableHead className="w-[100px]">Qty</TableHead>
              <TableHead className="w-[120px]">Unit Cost</TableHead>
              <TableHead className="w-[120px]">Total Amount</TableHead>
              <TableHead className="w-[120px]">Sales Person</TableHead>
              <TableHead className="w-[120px]">Invoice No</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentQuotations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                  No quotations found
                </TableCell>
              </TableRow>
            ) : (
              currentQuotations.map((quotation, index) => (
                <TableRow key={`${quotation["QUOTATION NO"]}-${index}`}>
                  <TableCell className="font-medium">{quotation["QUOTATION NO"]}</TableCell>
                  <TableCell>{quotation["QUOTATION DATE"]}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={quotation["CLIENT"]}>
                    {quotation["CLIENT"]}
                  </TableCell>
                  <TableCell>
                    <Badge variant={quotation["NEW/OLD"] === "NEW" ? "default" : "secondary"}>
                      {quotation["NEW/OLD"]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={quotation["DESCRIPTION 1"]}>
                    {quotation["DESCRIPTION 1"]}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={quotation["DESCRIPTION 2"]}>
                    {quotation["DESCRIPTION 2"]}
                  </TableCell>
                  <TableCell>{quotation["QTY"]}</TableCell>
                  <TableCell className="text-right">{formatAmount(quotation["UNIT COST"])}</TableCell>
                  <TableCell className="text-right font-medium">{formatAmount(quotation["TOTAL AMOUNT"])}</TableCell>
                  <TableCell>{quotation["SALES  PERSON"]}</TableCell>
                  <TableCell>{quotation["INVOICE NO"] || "-"}</TableCell>
                  <TableCell>{getStatusBadge(quotation["STATUS"])}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, quotations.length)} of {quotations.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
