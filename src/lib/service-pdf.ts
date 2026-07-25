import jsPDF from "jspdf";
import type { Service } from "./services-data";

export function downloadServicePdf(service: Service) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const writeParagraph = (text: string, size = 11, style: "normal" | "bold" = "normal", color: [number, number, number] = [40, 40, 55]) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, contentW);
    lines.forEach((line: string) => {
      ensureSpace(size + 4);
      doc.text(line, margin, y);
      y += size + 4;
    });
  };

  const writeHeading = (text: string) => {
    ensureSpace(28);
    y += 8;
    doc.setFillColor(255, 153, 0);
    doc.rect(margin, y - 10, 4, 14, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 7, 30);
    doc.text(text, margin + 12, y);
    y += 14;
  };

  const writeBullets = (items: string[]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 55);
    items.forEach((item) => {
      const lines = doc.splitTextToSize(item, contentW - 14);
      ensureSpace(lines.length * 15);
      doc.setFillColor(255, 153, 0);
      doc.circle(margin + 3, y - 3, 2, "F");
      lines.forEach((line: string, i: number) => {
        doc.text(line, margin + 14, y + i * 15);
      });
      y += lines.length * 15 + 2;
    });
  };

  // Cover header
  doc.setFillColor(0, 7, 30);
  doc.rect(0, 0, pageW, 140, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 153, 0);
  doc.text("100 WEB TECHNOLOGIES", margin, 55);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(service.title, contentW);
  doc.text(titleLines, margin, 90);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(220, 220, 235);
  doc.text(service.tagline, margin, 90 + titleLines.length * 22 + 8);
  y = 170;

  writeHeading("Overview");
  writeParagraph(service.overview);

  if (service.idealFor?.length) {
    writeHeading("Ideal for");
    writeBullets(service.idealFor);
  }

  writeHeading("Key benefits");
  service.benefits.forEach((b) => {
    writeParagraph(b.title, 12, "bold", [0, 7, 30]);
    writeParagraph(b.desc);
    y += 2;
  });

  if (service.challenges?.length) {
    writeHeading("Challenges we solve");
    service.challenges.forEach((c) => {
      writeParagraph(c.title, 12, "bold", [0, 7, 30]);
      writeParagraph(c.desc);
      y += 2;
    });
  }

  if (service.process?.length) {
    writeHeading("Our process");
    service.process.forEach((p) => {
      writeParagraph(`${p.step}  ${p.title}`, 12, "bold", [0, 7, 30]);
      writeParagraph(p.desc);
      y += 2;
    });
  }

  writeHeading("What we deliver");
  writeBullets(service.offerings);

  if (service.deliverables?.length) {
    writeHeading("Deliverables");
    writeBullets(service.deliverables);
  }

  if (service.techStack?.length) {
    writeHeading("Technology stack");
    writeParagraph(service.techStack.join("  •  "));
  }

  if (service.stats?.length) {
    writeHeading("Results at a glance");
    service.stats.forEach((s) => writeParagraph(`${s.value} — ${s.label}`, 11, "bold", [0, 7, 30]));
  }

  if (service.faqs?.length) {
    writeHeading("Frequently asked questions");
    service.faqs.forEach((f) => {
      writeParagraph(f.q, 12, "bold", [0, 7, 30]);
      writeParagraph(f.a);
      y += 2;
    });
  }

  writeHeading("Get in touch");
  writeParagraph("Email: hello@100web.in");
  writeParagraph("Web: 100web.in");

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(140, 140, 155);
    doc.text(`100 Web Technologies · ${service.badge}`, margin, pageH - 20);
    doc.text(`${i} / ${total}`, pageW - margin, pageH - 20, { align: "right" });
  }

  doc.save(`100web-${service.slug}.pdf`);
}