import jsPDF from "jspdf";
import type { ResumeTemplate } from "./types";
import { drawIcon } from "./pdf-icons";

export const PAGE = { w: 210, h: 297 };
export const FONT = { name: 28, title: 14, section: 17, body: 11, small: 10, caption: 9 };
export const LH = { body: 5.2, tight: 4.5, section: 8, item: 6 };

export type RGB = [number, number, number];

export interface TemplateTheme {
  primary: RGB;
  accent: RGB;
  text: RGB;
  muted: RGB;
  light: RGB;
  sidebar?: boolean;
  sidebarWidth?: number;
}

export const THEMES: Record<ResumeTemplate, TemplateTheme> = {
  modern: { primary: [99, 102, 241], accent: [139, 92, 246], text: [15, 23, 42], muted: [100, 116, 139], light: [238, 242, 255], sidebar: true, sidebarWidth: 58 },
  executive: { primary: [15, 23, 42], accent: [51, 65, 85], text: [15, 23, 42], muted: [71, 85, 105], light: [241, 245, 249], sidebar: false },
  professional: { primary: [30, 64, 175], accent: [59, 130, 246], text: [15, 23, 42], muted: [100, 116, 139], light: [239, 246, 255], sidebar: false },
  minimal: { primary: [55, 65, 81], accent: [107, 114, 128], text: [30, 41, 59], muted: [148, 163, 184], light: [248, 250, 252], sidebar: false },
  creative: { primary: [236, 72, 153], accent: [168, 85, 247], text: [15, 23, 42], muted: [100, 116, 139], light: [253, 242, 248], sidebar: true, sidebarWidth: 52 },
  corporate: { primary: [5, 150, 105], accent: [16, 185, 129], text: [15, 23, 42], muted: [100, 116, 139], light: [236, 253, 245], sidebar: false },
};

export class ResumePdfEngine {
  doc: jsPDF;
  y: number;
  page = 1;
  theme: TemplateTheme;
  template: ResumeTemplate;
  margin = { top: 16, bottom: 24, left: 15, right: 15 };
  sidebarContent: { skills: string[]; languages: string[]; contact: boolean } = { skills: [], languages: [], contact: false };

  constructor(template: ResumeTemplate) {
    this.template = template;
    this.theme = THEMES[template];
    this.doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
    this.y = this.margin.top;
  }

  get contentLeft(): number {
    return this.margin.left + (this.theme.sidebar ? (this.theme.sidebarWidth ?? 0) : 0);
  }

  get contentRight(): number {
    return PAGE.w - this.margin.right;
  }

  get contentWidth(): number {
    return this.contentRight - this.contentLeft;
  }

  get bottomLimit(): number {
    return PAGE.h - this.margin.bottom;
  }

  setColor(rgb: RGB, type: "text" | "draw" | "fill" = "text") {
    if (type === "text") this.doc.setTextColor(...rgb);
    else if (type === "draw") this.doc.setDrawColor(...rgb);
    else this.doc.setFillColor(...rgb);
  }

  ensureSpace(needed: number) {
    if (this.y + needed > this.bottomLimit) this.newPage();
  }

  newPage() {
    this.doc.addPage();
    this.page++;
    this.y = this.margin.top;
    this.drawPageChrome();
  }

  drawPageChrome() {
    if (!this.theme.sidebar) return;
    const sw = this.theme.sidebarWidth ?? 55;
    this.setColor(this.theme.primary, "fill");
    this.doc.rect(0, 0, sw, PAGE.h, "F");
    if (this.template === "creative") {
      this.setColor(this.theme.accent, "fill");
      this.doc.triangle(sw, 0, sw + 8, 0, sw, 12, "F");
    }
  }

  drawPageNumbers() {
    const total = this.doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      this.doc.setPage(i);
      this.setColor(this.theme.muted, "text");
      this.doc.setFontSize(FONT.caption);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(`${i} / ${total}`, PAGE.w / 2, PAGE.h - 10, { align: "center" });
    }
  }

  setMetadata(meta: { title: string; author: string; subject: string; keywords: string }) {
    this.doc.setProperties({
      title: meta.title,
      author: meta.author,
      subject: meta.subject,
      keywords: meta.keywords,
      creator: "VIZMAAR Resume Builder",
    });
  }

  drawSectionTitle(title: string, x?: number) {
    const left = x ?? this.contentLeft;
    this.ensureSpace(LH.section + 6);
    this.setColor(this.theme.primary, "text");
    this.doc.setFontSize(FONT.section);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title.toUpperCase(), left, this.y);

    if (this.template === "minimal") {
      this.setColor(this.theme.muted, "draw");
      this.doc.setLineWidth(0.2);
      this.doc.line(left, this.y + 2, left + this.contentWidth, this.y + 2);
    } else {
      this.setColor(this.theme.primary, "draw");
      this.doc.setLineWidth(0.6);
      const lineW = this.template === "executive" ? 40 : this.contentWidth * 0.35;
      this.doc.line(left, this.y + 2, left + lineW, this.y + 2);
    }
    this.y += LH.section + 4;
  }

  drawBodyText(text: string, x?: number, width?: number) {
    const left = x ?? this.contentLeft;
    const w = width ?? this.contentWidth;
    this.setColor(this.theme.text, "text");
    this.doc.setFontSize(FONT.body);
    this.doc.setFont("helvetica", "normal");
    const lines: string[] = this.doc.splitTextToSize(text, w);
    this.ensureSpace(lines.length * LH.body + 2);
    this.doc.text(lines, left, this.y);
    this.y += lines.length * LH.body + 4;
  }

  drawMutedText(text: string, x?: number) {
    const left = x ?? this.contentLeft;
    this.setColor(this.theme.muted, "text");
    this.doc.setFontSize(FONT.small);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(text, left, this.y);
    this.y += LH.tight + 2;
  }

  drawBullets(items: string[], x?: number, width?: number) {
    const left = (x ?? this.contentLeft) + 4;
    const w = (width ?? this.contentWidth) - 6;
    this.setColor(this.theme.text, "text");
    this.doc.setFontSize(FONT.body);
    this.doc.setFont("helvetica", "normal");

    for (const raw of items.filter(Boolean)) {
      const text = raw.replace(/^[•\-*]\s*/, "");
      const lines: string[] = this.doc.splitTextToSize(text, w);
      this.ensureSpace(lines.length * LH.body + 2);
      this.setColor(this.theme.primary, "fill");
      this.doc.circle(left - 3, this.y - 1.3, 0.7, "F");
      this.setColor(this.theme.text, "text");
      this.doc.text(lines, left, this.y);
      this.y += lines.length * LH.body + 2;
    }
    this.y += 2;
  }

  parseBullets(description: string): string[] {
    return description
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => l.replace(/^[•\-*]\s*/, ""));
  }

  drawSkillBadges(skills: string[], x?: number, maxWidth?: number) {
    const left = x ?? this.contentLeft;
    const right = left + (maxWidth ?? this.contentWidth);
    const badgeH = 6.5;
    const padX = 3;
    const gap = 2.5;
    let cx = left;

    this.ensureSpace(badgeH + 4);
    this.doc.setFontSize(FONT.caption);
    this.doc.setFont("helvetica", "normal");

    for (const skill of skills) {
      const tw = this.doc.getTextWidth(skill);
      const bw = tw + padX * 2;
      if (cx + bw > right) {
        cx = left;
        this.y += badgeH + gap;
        this.ensureSpace(badgeH + 4);
      }
      this.setColor(this.theme.light, "fill");
      this.setColor(this.theme.primary, "draw");
      this.doc.setLineWidth(0.2);
      this.doc.roundedRect(cx, this.y - 4.2, bw, badgeH, 1.5, 1.5, "FD");
      this.setColor(this.theme.primary, "text");
      this.doc.text(skill, cx + padX, this.y);
      cx += bw + gap;
    }
    this.y += badgeH + 6;
  }

  drawContactItem(
    type: "email" | "phone" | "location" | "linkedin" | "website",
    value: string,
    x: number,
    onDark = false
  ) {
    if (!value) return;
    const iconColor: RGB = onDark ? [255, 255, 255] : this.theme.primary;
    const textColor: RGB = onDark ? [255, 255, 255] : this.theme.text;
    this.ensureSpace(LH.body + 2);
    drawIcon(this.doc, type, x, this.y, iconColor);
    this.setColor(textColor, "text");
    this.doc.setFontSize(FONT.small);
    this.doc.setFont("helvetica", "normal");
    const display = type === "linkedin" ? value.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "linkedin.com/in/") : value;
    const lines: string[] = this.doc.splitTextToSize(display, this.contentWidth - 8);
    this.doc.text(lines[0], x + 6, this.y);
    this.y += LH.body + 1.5;
  }

  drawSidebarSection(title: string, x: number) {
    this.setColor([255, 255, 255], "text");
    this.doc.setFontSize(FONT.small);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title.toUpperCase(), x, this.y);
    this.y += LH.tight + 3;
  }

  drawSidebarContact(items: { type: "email" | "phone" | "location" | "linkedin" | "website"; value: string }[], x: number) {
    for (const item of items) {
      if (!item.value) continue;
      drawIcon(this.doc, item.type, x, this.y, [255, 255, 255]);
      this.setColor([255, 255, 255], "text");
      this.doc.setFontSize(8.5);
      this.doc.setFont("helvetica", "normal");
      const lines: string[] = this.doc.splitTextToSize(item.value, (this.theme.sidebarWidth ?? 55) - x - 4);
      this.doc.text(lines[0], x + 5.5, this.y);
      this.y += LH.tight + 2;
    }
  }

  drawExperienceBlock(
    position: string,
    company: string,
    dates: string,
    bullets: string[]
  ) {
    this.ensureSpace(14);
    this.setColor(this.theme.text, "text");
    this.doc.setFontSize(FONT.body + 1);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(position, this.contentLeft, this.y);

    const dateW = this.doc.getTextWidth(dates);
    this.setColor(this.theme.muted, "text");
    this.doc.setFontSize(FONT.small);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(dates, this.contentRight - dateW, this.y);
    this.y += LH.tight + 1;

    this.setColor(this.theme.primary, "text");
    this.doc.setFontSize(FONT.small);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(company, this.contentLeft, this.y);
    this.y += LH.tight + 3;

    if (bullets.length > 0) this.drawBullets(bullets);
    this.y += LH.item;
  }

  drawEducationBlock(degree: string, institution: string, dates: string, extra?: string) {
    this.ensureSpace(12);
    this.setColor(this.theme.text, "text");
    this.doc.setFontSize(FONT.body);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(degree, this.contentLeft, this.y);
    this.y += LH.tight + 1;
    this.setColor(this.theme.muted, "text");
    this.doc.setFontSize(FONT.small);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(`${institution}  ·  ${dates}${extra ? `  ·  ${extra}` : ""}`, this.contentLeft, this.y);
    this.y += LH.item + 2;
  }

  addImage(dataUrl: string, x: number, y: number, w: number, h: number) {
    try {
      const fmt = dataUrl.includes("image/png") ? "PNG" : "JPEG";
      this.doc.addImage(dataUrl, fmt, x, y, w, h);
    } catch {
      // skip invalid image
    }
  }

  addQrCode(dataUrl: string, x: number, y: number, size: number) {
    try {
      this.doc.addImage(dataUrl, "PNG", x, y, size, size);
    } catch {
      // skip
    }
  }
}
