import QRCode from "qrcode";
import type { ResumeData, ResumePdfOptions } from "./types";
import { calculateATSScore } from "./ats-scorer";
import { ResumePdfEngine } from "./pdf-engine";
import { renderResumeLayout, renderAtsSection } from "./pdf-layouts";
import { FONT, LH } from "./pdf-engine";

async function generateLinkedInQr(linkedin: string): Promise<string | null> {
  if (!linkedin?.trim()) return null;
  const url = linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`;
  try {
    return await QRCode.toDataURL(url, { width: 200, margin: 1, color: { dark: "#1e293b", light: "#ffffff" } });
  } catch {
    return null;
  }
}

export async function exportResumePDF(
  data: ResumeData,
  options: ResumePdfOptions = {}
): Promise<void> {
  const {
    includeAtsSection = true,
    includeProfileImage = true,
    includeLinkedInQr = true,
    profileImage = data.profileImage,
  } = options;

  const eng = new ResumePdfEngine(data.template);
  const name = data.personal.fullName || "Professional";
  const keywords = data.skills.map((s) => s.name).join(", ");

  eng.setMetadata({
    title: `${name} — Resume`,
    author: name,
    subject: `Professional Resume — ${data.personal.title || data.targetRole || "Career Document"}`,
    keywords: keywords || "resume, professional, career",
  });

  const qrUrl = includeLinkedInQr ? await generateLinkedInQr(data.personal.linkedin) : null;
  const photo = includeProfileImage && profileImage ? profileImage : null;

  renderResumeLayout(eng, data, { profileImage: photo, qrUrl });

  if (includeAtsSection) {
    const ats = calculateATSScore(data);
    renderAtsSection(eng, ats);
  }

  eng.drawPageNumbers();

  const filename = `${name.replace(/\s+/g, "_")}_${data.template}_resume.pdf`;
  eng.doc.save(filename);
}

export async function exportCoverLetterPDF(data: ResumeData, body: string): Promise<void> {
  const eng = new ResumePdfEngine(data.template);
  const name = data.personal.fullName || "Your Name";
  const theme = eng.theme;

  eng.setMetadata({
    title: `${name} — Cover Letter`,
    author: name,
    subject: "Cover Letter",
    keywords: data.targetRole || "cover letter",
  });

  eng.setColor(theme.primary, "fill");
  eng.doc.rect(0, 0, 210, 4, "F");
  eng.y = 20;

  eng.setColor(theme.text, "text");
  eng.doc.setFontSize(FONT.name - 6);
  eng.doc.setFont("helvetica", "bold");
  eng.doc.text(name, eng.contentLeft, eng.y);
  eng.y += 8;

  eng.setColor(theme.muted, "text");
  eng.doc.setFontSize(FONT.small);
  eng.doc.setFont("helvetica", "normal");
  const contact = [data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join("  ·  ");
  eng.doc.text(contact, eng.contentLeft, eng.y);
  eng.y += 14;

  eng.setColor(theme.text, "text");
  eng.doc.setFontSize(FONT.body);
  const lines: string[] = eng.doc.splitTextToSize(body, eng.contentWidth);
  for (const line of lines) {
    eng.ensureSpace(LH.body);
    eng.doc.text(line, eng.contentLeft, eng.y);
    eng.y += LH.body;
  }

  eng.drawPageNumbers();
  eng.doc.save(`cover_letter_${name.replace(/\s+/g, "_")}.pdf`);
}
