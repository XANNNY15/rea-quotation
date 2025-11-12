import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Quotation } from "@/types/quotation";
import { useToast } from "@/hooks/use-toast";

interface AddQuotationDialogProps {
  onAdd: (quotation: Quotation) => void;
}

export const AddQuotationDialog = ({ onAdd }: AddQuotationDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Quotation>({
    "QUOTATION NO": "",
    "QUOTATION DATE": "",
    "CLIENT": "",
    "NEW/OLD": "NEW",
    "DESCRIPTION 1": "",
    "DESCRIPTION 2": "",
    "QTY": "",
    "UNIT COST": "",
    "TOTAL AMOUNT": "",
    "SALES  PERSON": "",
    "INVOICE NO": "",
    "STATUS": "PENDING",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData["QUOTATION NO"] || !formData.CLIENT || !formData["QUOTATION DATE"]) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in Quotation No, Client, and Date",
        variant: "destructive",
      });
      return;
    }

    onAdd(formData);
    toast({
      title: "Quotation Added",
      description: `Quotation ${formData["QUOTATION NO"]} has been added successfully.`,
    });
    
    // Reset form
    setFormData({
      "QUOTATION NO": "",
      "QUOTATION DATE": "",
      "CLIENT": "",
      "NEW/OLD": "NEW",
      "DESCRIPTION 1": "",
      "DESCRIPTION 2": "",
      "QTY": "",
      "UNIT COST": "",
      "TOTAL AMOUNT": "",
      "SALES  PERSON": "",
      "INVOICE NO": "",
      "STATUS": "PENDING",
    });
    setOpen(false);
  };

  const handleChange = (field: keyof Quotation, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate total amount if qty and unit cost are present
      if (field === "QTY" || field === "UNIT COST") {
        const qty = parseFloat((field === "QTY" ? value : updated.QTY).replace(/,/g, "")) || 0;
        const unitCost = parseFloat((field === "UNIT COST" ? value : updated["UNIT COST"]).replace(/,/g, "")) || 0;
        const total = qty * unitCost;
        updated["TOTAL AMOUNT"] = total > 0 ? total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";
      }
      
      return updated;
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-teal hover:bg-brand-teal/90">
          <Plus className="w-4 h-4 mr-2" />
          Add New Quotation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Quotation</DialogTitle>
          <DialogDescription>
            Fill in the quotation details below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quotationNo">Quotation No *</Label>
              <Input
                id="quotationNo"
                value={formData["QUOTATION NO"]}
                onChange={(e) => handleChange("QUOTATION NO", e.target.value)}
                placeholder="e.g., 25-0001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Quotation Date *</Label>
              <Input
                id="date"
                value={formData["QUOTATION DATE"]}
                onChange={(e) => handleChange("QUOTATION DATE", e.target.value)}
                placeholder="e.g., 01-Jan-25"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                value={formData.CLIENT}
                onChange={(e) => handleChange("CLIENT", e.target.value)}
                placeholder="Client name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newOld">Client Type</Label>
              <Select value={formData["NEW/OLD"]} onValueChange={(value) => handleChange("NEW/OLD", value)}>
                <SelectTrigger id="newOld">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">NEW</SelectItem>
                  <SelectItem value="OLD">OLD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salesPerson">Sales Person</Label>
              <Input
                id="salesPerson"
                value={formData["SALES  PERSON"]}
                onChange={(e) => handleChange("SALES  PERSON", e.target.value)}
                placeholder="Sales person name"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="desc1">Description 1</Label>
              <Textarea
                id="desc1"
                value={formData["DESCRIPTION 1"]}
                onChange={(e) => handleChange("DESCRIPTION 1", e.target.value)}
                placeholder="Main description"
                rows={2}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="desc2">Description 2</Label>
              <Textarea
                id="desc2"
                value={formData["DESCRIPTION 2"]}
                onChange={(e) => handleChange("DESCRIPTION 2", e.target.value)}
                placeholder="Additional details"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qty">Quantity</Label>
              <Input
                id="qty"
                value={formData.QTY}
                onChange={(e) => handleChange("QTY", e.target.value)}
                placeholder="e.g., 100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitCost">Unit Cost</Label>
              <Input
                id="unitCost"
                type="number"
                step="0.01"
                value={formData["UNIT COST"]}
                onChange={(e) => handleChange("UNIT COST", e.target.value)}
                placeholder="e.g., 150.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                value={formData["TOTAL AMOUNT"]}
                onChange={(e) => handleChange("TOTAL AMOUNT", e.target.value)}
                placeholder="Auto-calculated or manual"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.STATUS} onValueChange={(value) => handleChange("STATUS", value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="INVOICED">INVOICED</SelectItem>
                  <SelectItem value="REGRET">REGRET</SelectItem>
                  <SelectItem value="OPEN">OPEN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="invoiceNo">Invoice No</Label>
              <Input
                id="invoiceNo"
                value={formData["INVOICE NO"]}
                onChange={(e) => handleChange("INVOICE NO", e.target.value)}
                placeholder="Leave empty if not invoiced"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-teal hover:bg-brand-teal/90">
              Add Quotation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
