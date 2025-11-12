import { useState, useMemo } from "react";
import { QuotationFilters } from "@/components/QuotationFilters";
import { QuotationStats } from "@/components/QuotationStats";
import { QuotationTable } from "@/components/QuotationTable";
import { Quotation } from "@/types/quotation";
import quotationsData from "@/data/quotations.json";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Index = () => {
  const [filters, setFilters] = useState({
    client: "all",
    status: "all",
    salesPerson: "all",
    newOld: "all",
    quotationNo: "",
    invoiceNo: "",
    dateFrom: "",
    dateTo: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const quotations = quotationsData as Quotation[];

  // Get unique values for filters
  const uniqueClients = useMemo(() => {
    return Array.from(new Set(quotations.map((q) => q.CLIENT))).sort();
  }, [quotations]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(quotations.map((q) => q.STATUS))).sort();
  }, [quotations]);

  const uniqueSalesPeople = useMemo(() => {
    return Array.from(new Set(quotations.map((q) => q["SALES  PERSON"]))).sort();
  }, [quotations]);

  // Filter quotations
  const filteredQuotations = useMemo(() => {
    return quotations.filter((quotation) => {
      // Search query filter (searches across all fields)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableFields = [
          quotation["QUOTATION NO"],
          quotation.CLIENT,
          quotation["DESCRIPTION 1"],
          quotation["DESCRIPTION 2"],
          quotation["SALES  PERSON"],
          quotation.STATUS,
          quotation["INVOICE NO"],
        ];
        if (!searchableFields.some((field) => field.toLowerCase().includes(query))) {
          return false;
        }
      }

      // Client filter
      if (filters.client !== "all" && quotation.CLIENT !== filters.client) {
        return false;
      }

      // Status filter
      if (filters.status !== "all" && quotation.STATUS !== filters.status) {
        return false;
      }

      // Sales person filter
      if (filters.salesPerson !== "all" && quotation["SALES  PERSON"] !== filters.salesPerson) {
        return false;
      }

      // New/Old filter
      if (filters.newOld !== "all" && quotation["NEW/OLD"] !== filters.newOld) {
        return false;
      }

      // Quotation number filter
      if (filters.quotationNo && !quotation["QUOTATION NO"].toLowerCase().includes(filters.quotationNo.toLowerCase())) {
        return false;
      }

      // Invoice number filter
      if (filters.invoiceNo && !quotation["INVOICE NO"].toLowerCase().includes(filters.invoiceNo.toLowerCase())) {
        return false;
      }

      // Date filters
      if (filters.dateFrom || filters.dateTo) {
        const quotationDate = parseDate(quotation["QUOTATION DATE"]);
        if (filters.dateFrom && quotationDate < new Date(filters.dateFrom)) {
          return false;
        }
        if (filters.dateTo && quotationDate > new Date(filters.dateTo)) {
          return false;
        }
      }

      return true;
    });
  }, [quotations, filters, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAmount = filteredQuotations.reduce((sum, q) => {
      const amount = parseFloat(q["TOTAL AMOUNT"].replace(/,/g, ""));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const invoicedCount = filteredQuotations.filter((q) => q.STATUS === "INVOICED").length;
    const regretCount = filteredQuotations.filter((q) => q.STATUS === "REGRET").length;

    return {
      totalQuotations: filteredQuotations.length,
      totalAmount,
      invoicedCount,
      regretCount,
    };
  }, [filteredQuotations]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      client: "all",
      status: "all",
      salesPerson: "all",
      newOld: "all",
      quotationNo: "",
      invoiceNo: "",
      dateFrom: "",
      dateTo: "",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("-");
    const monthMap: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    return new Date(2000 + parseInt(year), monthMap[month], parseInt(day));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Quotation Tracker 2025</h1>
          <p className="text-muted-foreground">Manage and track all your quotations in one place</p>
        </header>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search across all fields..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        <QuotationStats
          totalQuotations={stats.totalQuotations}
          totalAmount={stats.totalAmount}
          invoicedCount={stats.invoicedCount}
          regretCount={stats.regretCount}
        />

        <QuotationFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          uniqueClients={uniqueClients}
          uniqueStatuses={uniqueStatuses}
          uniqueSalesPeople={uniqueSalesPeople}
        />

        <div className="mt-6">
          <QuotationTable
            quotations={filteredQuotations}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
