import type jsPDF from "jspdf";

type RGB = [number, number, number];

/** Draw minimalist contact icons (3.5mm) at (x, y) baseline */
export function drawIcon(
  doc: jsPDF,
  type: "email" | "phone" | "location" | "linkedin" | "website",
  x: number,
  y: number,
  color: RGB
) {
  const s = 3.5;
  doc.setDrawColor(...color);
  doc.setFillColor(...color);
  doc.setLineWidth(0.35);

  switch (type) {
    case "email": {
      doc.rect(x, y - s + 0.8, s, s - 1.2, "S");
      doc.line(x, y - s + 0.8, x + s / 2, y - s / 2 + 0.5);
      doc.line(x + s, y - s + 0.8, x + s / 2, y - s / 2 + 0.5);
      break;
    }
    case "phone": {
      doc.roundedRect(x + 0.6, y - s + 0.3, s - 1.2, s - 0.5, 0.8, 0.8, "S");
      doc.circle(x + s / 2, y - 1.2, 0.5, "F");
      break;
    }
    case "location": {
      doc.circle(x + s / 2, y - s / 2, s / 3, "S");
      doc.line(x + s / 2, y - s / 2 + s / 3, x + s / 2, y - 0.3);
      doc.line(x + s / 2 - 0.5, y - 0.3, x + s / 2 + 0.5, y - 0.3);
      break;
    }
    case "linkedin": {
      doc.roundedRect(x, y - s + 0.2, s, s - 0.4, 0.5, 0.5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(5);
      doc.setFont("helvetica", "bold");
      doc.text("in", x + 0.7, y - 0.8);
      break;
    }
    case "website": {
      doc.circle(x + s / 2, y - s / 2, s / 2 - 0.2, "S");
      doc.line(x + 0.3, y - s / 2, x + s - 0.3, y - s / 2);
      doc.line(x + s / 2, y - s + 0.3, x + s / 2, y - 0.5);
      break;
    }
  }
}
