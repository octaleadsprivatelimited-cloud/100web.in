import { jsPDF } from "jspdf";

export function downloadInvoicePdf(invoice: any) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const billing = invoice.billing_snapshot || {};
  const left = 18; const right = 192;
  const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: invoice.currency || "INR" }).format((invoice.amount_minor || 0) / 100);
  const formatDate = (value?: string) => {
    if (!value) return "Not available";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "Not available" : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(parsed);
  };
  const label = (text: string, x: number, y: number) => { doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(98, 110, 128); doc.text(text.toUpperCase(), x, y); };
  const normal = (text: string, x: number, y: number, options: any = {}) => { doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(25, 38, 57); doc.text(text, x, y, options); };
  doc.setFillColor(0, 68, 128); doc.rect(0, 0, 210, 35, "F"); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.text("100 Web Technologies", left, 17); doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.text("PAYMENT INVOICE", left, 25);
  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.text("INVOICE", right, 16, { align: "right" }); doc.setFontSize(9); doc.text(invoice.invoice_number || "INVOICE", right, 24, { align: "right" });
  let y = 48; label("Bill to", left, y); label("Invoice date", 124, y); y += 6; normal(billing.name || billing.company || "Customer", left, y); normal(formatDate(invoice.issued_at), 124, y); y += 5; normal(billing.company || "", left, y); label("Payment date", 124, y - 5); normal(formatDate(invoice.paid_at), 124, y); y += 5; normal(billing.email || "", left, y); label("Transaction ID", 124, y - 5); normal(invoice.provider_payment_id || "Verified payment", 124, y);
  y += 12; doc.setFillColor(242, 246, 251); doc.roundedRect(left, y, right - left, 11, 1.5, 1.5, "F"); doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(0, 58, 112); doc.text("DESCRIPTION", left + 4, y + 7); doc.text("AMOUNT", right - 4, y + 7, { align: "right" });
  y += 18; doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(25, 38, 57); doc.text(invoice.item_name || "Professional services", left + 4, y); doc.text(money, right - 4, y, { align: "right" }); y += 6; doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(75, 88, 105); const descriptionLines = doc.splitTextToSize(invoice.description || "Professional services delivered as agreed.", 125); doc.text(descriptionLines, left + 4, y);
  y += Math.max(22, descriptionLines.length * 4.5 + 12); doc.setDrawColor(210, 218, 229); doc.line(left, y, right, y); y += 10; doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0, 68, 128); doc.text("Total paid", 130, y); doc.setFontSize(14); doc.text(money, right, y, { align: "right" });
  y += 18; doc.setFillColor(240, 253, 244); doc.roundedRect(left, y, right - left, 14, 1.5, 1.5, "F"); doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(20, 110, 60); doc.text("PAYMENT VERIFIED", left + 4, y + 6); doc.setFont("helvetica", "normal"); doc.setTextColor(48, 95, 65); doc.text("This invoice is generated from the verified payment record in your customer account.", left + 4, y + 11);
  doc.setFontSize(8); doc.setTextColor(110, 120, 135); doc.text("Thank you for your business.", left, 286); doc.text(`Invoice ${invoice.invoice_number || ""}`, right, 286, { align: "right" });
  doc.save(`${invoice.invoice_number || "invoice"}.pdf`);
}
