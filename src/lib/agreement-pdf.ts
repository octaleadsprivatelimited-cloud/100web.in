import { jsPDF } from "jspdf";

const formatDate = (value?: unknown) => {
  if (!value) return "Not specified";
  const parsed = new Date(typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : String(value));
  return Number.isNaN(parsed.getTime()) ? "Not specified" : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(parsed);
};

export function downloadAgreementPdf(project: any, account: any) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const amount = new Intl.NumberFormat("en-IN", { style: "currency", currency: project.currency || "INR" }).format((project.quoted_amount_minor || 0) / 100);
  const agreementNo = project.agreement_number || "SERVICE-AGREEMENT";
  const left = 18; const right = 192; let y = 18;
  const line = () => { doc.setDrawColor(210, 218, 229); doc.line(left, y, right, y); };
  const label = (text: string, x: number, at: number) => { doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(98, 110, 128); doc.text(text.toUpperCase(), x, at); };
  const value = (text: string, x: number, at: number, options: any = {}) => { doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(25, 38, 57); doc.text(text, x, at, options); };
  const addHeader = () => {
    doc.setFillColor(0, 68, 128); doc.rect(0, 0, 210, 35, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.text("100 Web Technologies", left, 17);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.text("PROJECT SERVICE AGREEMENT", left, 25);
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("AGREEMENT", right, 16, { align: "right" }); doc.setFontSize(9); doc.text(agreementNo, right, 24, { align: "right" });
  };
  const section = (title: string) => { y += 10; doc.setFillColor(242, 246, 251); doc.roundedRect(left, y - 6, right - left, 9, 1.5, 1.5, "F"); doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(0, 58, 112); doc.text(title, left + 4, y); y += 8; };
  const paragraph = (text: string) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(48, 62, 80);
    const lines = doc.splitTextToSize(text, right - left);
    if (y + lines.length * 4.5 > 273) { doc.addPage(); addHeader(); y = 48; }
    doc.text(lines, left, y); y += lines.length * 4.5 + 4;
  };

  addHeader();
  y = 48; label("Issued to", left, y); label("Agreement date", 124, y); y += 6;
  value(account.billing_name || account.company || "Customer", left, y); value(formatDate(project.proposal_sent_at || project.created_at), 124, y); y += 5;
  value(account.company || "", left, y); label("Target completion", 124, y - 5); value(formatDate(project.due_at), 124, y);
  y += 8; line();
  section("Project summary");
  label("Project name", left, y); label("Service category", 84, y); label("Agreed service value", 144, y); y += 6;
  value(project.name || "Project", left, y); value(project.service_type || "Professional services", 84, y); doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0, 68, 128); doc.text(amount, right, y, { align: "right" }); y += 10; line();
  section("Scope and commercial terms");
  paragraph(`100 Web Technologies will provide the agreed ${project.service_type || "professional"} services for the project named "${project.name || "Project"}". The agreed service value is ${amount}. The project is scheduled to begin after payment has been successfully verified through the approved payment channel.`);
  paragraph("The customer will provide timely access, content, approvals and any third-party credentials required for delivery. Requests outside the agreed scope, including additional features, integrations, revisions or licences, may require a revised quotation and timeline.");
  section("Delivery, approval and ownership");
  paragraph("The target completion date is an estimate based on timely customer inputs and approvals. Project milestones will be shared through the customer portal or project communication. Once payment obligations are met, the customer receives the agreed deliverables and the approved source-files link, where applicable. Third-party tools, stock assets, fonts, hosting and licence terms remain subject to their respective providers.");
  section("Payment and cancellation");
  paragraph("Payment is due using the secure payment link in the customer portal. Work is not treated as started until payment is verified. Each verified payment creates a downloadable invoice in the customer portal. Cancellation, pause, refund and support matters are handled according to the approved commercial discussion and applicable law.");
  if (project.agreement_terms) { section("Project-specific notes"); paragraph(project.agreement_terms); }
  section("Acceptance");
  paragraph("By paying the linked project invoice or providing written approval, the customer confirms acceptance of this agreement, the project scope and the payment terms above.");
  if (y > 255) { doc.addPage(); addHeader(); y = 60; }
  y += 10; doc.setDrawColor(210, 218, 229); doc.line(left, y, 86, y); doc.line(124, y, right, y); y += 5; label("For 100 Web Technologies", left, y); label("Customer approval", 124, y);
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) { doc.setPage(page); doc.setFontSize(8); doc.setTextColor(110, 120, 135); doc.text(`Generated from the customer portal - ${agreementNo}`, left, 286); doc.text(`Page ${page} of ${pages}`, right, 286, { align: "right" }); }
  doc.save(`${agreementNo}.pdf`);
}
