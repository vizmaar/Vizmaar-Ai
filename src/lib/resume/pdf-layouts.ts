import type { ResumeData, ATSScore } from "./types";
import { ResumePdfEngine, FONT, LH, PAGE } from "./pdf-engine";
import { drawIcon } from "./pdf-icons";

function formatDate(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return m ? `${months[parseInt(m, 10) - 1]} ${y}` : d;
}

function expDates(start: string, end: string, current: boolean) {
  return `${formatDate(start)} — ${current ? "Present" : formatDate(end)}`;
}

function contactItems(data: ResumeData) {
  const { personal } = data;
  return [
    { type: "email" as const, value: personal.email },
    { type: "phone" as const, value: personal.phone },
    { type: "location" as const, value: personal.location },
    { type: "linkedin" as const, value: personal.linkedin },
    { type: "website" as const, value: personal.website },
  ];
}

function renderMainSections(eng: ResumePdfEngine, data: ResumeData) {
  if (data.summary) {
    eng.drawSectionTitle("Professional Summary");
    eng.drawBodyText(data.summary);
    eng.y += 2;
  }

  if (data.experience.length > 0) {
    eng.drawSectionTitle("Work Experience");
    for (const exp of data.experience) {
      const bullets = [
        ...exp.achievements.filter(Boolean),
        ...eng.parseBullets(exp.description),
      ];
      eng.drawExperienceBlock(
        exp.position || "Position",
        exp.company || "Company",
        expDates(exp.startDate, exp.endDate, exp.current),
        bullets
      );
    }
  }

  if (data.education.length > 0) {
    eng.drawSectionTitle("Education");
    for (const edu of data.education) {
      eng.drawEducationBlock(
        `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`,
        edu.institution || "Institution",
        `${formatDate(edu.startDate)} — ${formatDate(edu.endDate)}`,
        edu.gpa ? `GPA: ${edu.gpa}` : undefined
      );
    }
  }

  if (data.skills.length > 0 && !eng.theme.sidebar) {
    eng.drawSectionTitle("Skills");
    eng.drawSkillBadges(data.skills.map((s) => s.name));
  }

  if (data.certifications.length > 0) {
    eng.drawSectionTitle("Certifications");
    eng.drawBullets(
      data.certifications.map((c) => `${c.name} — ${c.issuer}${c.date ? ` (${formatDate(c.date)})` : ""}`)
    );
  }

  if (data.projects.length > 0) {
    eng.drawSectionTitle("Projects");
    for (const proj of data.projects) {
      eng.ensureSpace(14);
      eng.setColor(eng.theme.text, "text");
      eng.doc.setFontSize(FONT.body);
      eng.doc.setFont("helvetica", "bold");
      eng.doc.text(proj.name || "Project", eng.contentLeft, eng.y);
      eng.y += LH.tight + 1;
      if (proj.description) eng.drawBodyText(proj.description);
      if (proj.technologies.length > 0) {
        eng.drawSkillBadges(proj.technologies);
      } else if (proj.url) {
        eng.drawMutedText(proj.url);
      }
      eng.y += 2;
    }
  }

  if (data.achievements.length > 0) {
    eng.drawSectionTitle("Achievements");
    eng.drawBullets(
      data.achievements.map((a) => (a.description ? `${a.title}: ${a.description}` : a.title))
    );
  }

  if (data.languages.length > 0 && !eng.theme.sidebar) {
    eng.drawSectionTitle("Languages");
    eng.drawSkillBadges(
      data.languages.map((l) => `${l.name} (${l.proficiency})`)
    );
  }

  if (data.references.length > 0) {
    eng.drawSectionTitle("References");
    for (const ref of data.references) {
      eng.ensureSpace(12);
      eng.setColor(eng.theme.text, "text");
      eng.doc.setFontSize(FONT.body);
      eng.doc.setFont("helvetica", "bold");
      eng.doc.text(ref.name, eng.contentLeft, eng.y);
      eng.y += LH.tight;
      eng.drawMutedText(
        [ref.title, ref.company, ref.email, ref.phone].filter(Boolean).join("  ·  ")
      );
    }
  }
}

function renderSidebarContent(eng: ResumePdfEngine, data: ResumeData, startY: number) {
  if (!eng.theme.sidebar) return;
  const savedY = eng.y;
  eng.y = startY;
  const x = 8;

  eng.drawSidebarSection("Contact", x);
  eng.drawSidebarContact(contactItems(data), x);
  eng.y += 4;

  if (data.skills.length > 0) {
    eng.drawSidebarSection("Skills", x);
    eng.setColor([255, 255, 255], "text");
    eng.doc.setFontSize(8.5);
    for (const skill of data.skills) {
      eng.doc.text(`• ${skill.name}`, x + 2, eng.y);
      eng.y += LH.tight + 1;
    }
    eng.y += 4;
  }

  if (data.languages.length > 0) {
    eng.drawSidebarSection("Languages", x);
    eng.setColor([255, 255, 255], "text");
    eng.doc.setFontSize(8.5);
    for (const lang of data.languages) {
      eng.doc.text(`${lang.name} — ${lang.proficiency}`, x + 2, eng.y);
      eng.y += LH.tight + 1;
    }
  }

  eng.y = savedY;
}

function drawModernHeader(eng: ResumePdfEngine, data: ResumeData, profileImage?: string | null, qrUrl?: string | null) {
  const sw = eng.theme.sidebarWidth ?? 58;
  eng.drawPageChrome();

  let photoY = 18;
  if (profileImage) {
    eng.addImage(profileImage, 10, 14, 38, 38);
    photoY = 56;
  }

  eng.y = photoY;
  const x = 8;
  eng.setColor([255, 255, 255], "text");
  eng.doc.setFontSize(FONT.title);
  eng.doc.setFont("helvetica", "bold");
  const nameLines: string[] = eng.doc.splitTextToSize(data.personal.fullName || "Your Name", sw - 12);
  eng.doc.text(nameLines, x, eng.y);
  eng.y += nameLines.length * 6 + 2;
  eng.doc.setFontSize(FONT.small);
  eng.doc.setFont("helvetica", "normal");
  eng.doc.text(data.personal.title || data.targetRole || "", x, eng.y);

  if (qrUrl) eng.addQrCode(qrUrl, sw - 22, PAGE.h - 32, 18);

  eng.y = eng.margin.top;
  eng.setColor(eng.theme.text, "text");
  eng.doc.setFontSize(FONT.name);
  eng.doc.setFont("helvetica", "bold");
  eng.doc.text(data.personal.fullName || "Your Name", eng.contentLeft, eng.y + 4);
  eng.y += 12;
  eng.setColor(eng.theme.primary, "text");
  eng.doc.setFontSize(FONT.title);
  eng.doc.setFont("helvetica", "normal");
  eng.doc.text(data.personal.title || data.targetRole || "", eng.contentLeft, eng.y);
  eng.y += LH.section + 2;
}

function drawExecutiveHeader(eng: ResumePdfEngine, data: ResumeData, profileImage?: string | null, qrUrl?: string | null) {
  const bandH = 52;
  eng.setColor(eng.theme.primary, "fill");
  eng.doc.rect(0, 0, PAGE.w, bandH, "F");

  const nameX = profileImage ? 38 : eng.margin.left;
  eng.setColor([255, 255, 255], "text");
  eng.doc.setFontSize(30);
  eng.doc.setFont("helvetica", "bold");
  eng.doc.text(data.personal.fullName || "Your Name", nameX, 22);
  eng.doc.setFontSize(FONT.title);
  eng.doc.setFont("helvetica", "normal");
  eng.doc.text(data.personal.title || data.targetRole || "", nameX, 32);

  if (profileImage) eng.addImage(profileImage, eng.margin.left, 10, 28, 28);

  eng.y = 40;
  const items = contactItems(data).filter((i) => i.value);
  let cx = nameX;
  for (const item of items) {
    drawIcon(eng.doc, item.type, cx, eng.y, [255, 255, 255]);
    eng.setColor([255, 255, 255], "text");
    eng.doc.setFontSize(8.5);
    const label = item.value.length > 35 ? item.value.slice(0, 33) + "…" : item.value;
    eng.doc.text(label, cx + 5, eng.y);
    cx += eng.doc.getTextWidth(label) + 14;
    if (cx > PAGE.w - 30) { cx = nameX; eng.y += 5; }
  }

  if (qrUrl) eng.addQrCode(qrUrl, PAGE.w - eng.margin.right - 18, 8, 18);

  eng.y = bandH + 10;
  eng.setColor(eng.theme.text, "text");
}

function drawProfessionalHeader(eng: ResumePdfEngine, data: ResumeData, profileImage?: string | null, qrUrl?: string | null) {
  const left = eng.contentLeft;
  if (profileImage) {
    eng.addImage(profileImage, eng.contentRight - 28, eng.margin.top, 26, 26);
  }
  eng.setColor(eng.theme.primary, "text");
  eng.doc.setFontSize(FONT.name);
  eng.doc.setFont("helvetica", "bold");
  eng.doc.text(data.personal.fullName || "Your Name", left, eng.y + 6);
  eng.y += 14;
  eng.doc.setFontSize(FONT.title);
  eng.doc.setFont("helvetica", "normal");
  eng.doc.text(data.personal.title || data.targetRole || "", left, eng.y);
  eng.y += 6;
  eng.setColor(eng.theme.primary, "draw");
  eng.doc.setLineWidth(1);
  eng.doc.line(left, eng.y, eng.contentRight, eng.y);
  eng.y += 8;

  let cx = left;
  for (const item of contactItems(data).filter((i) => i.value)) {
    drawIcon(eng.doc, item.type, cx, eng.y, eng.theme.primary);
    eng.setColor(eng.theme.text, "text");
    eng.doc.setFontSize(FONT.small);
    const label = item.value.length > 40 ? item.value.slice(0, 38) + "…" : item.value;
    eng.doc.text(label, cx + 5.5, eng.y);
    cx += eng.doc.getTextWidth(label) + 16;
    if (cx > eng.contentRight - 30) { cx = left; eng.y += 6; }
  }
  if (qrUrl) eng.addQrCode(qrUrl, eng.contentRight - 16, eng.margin.top, 16);
  eng.y += LH.section;
}

function drawMinimalHeader(eng: ResumePdfEngine, data: ResumeData, profileImage?: string | null, qrUrl?: string | null) {
  const left = eng.contentLeft;
  if (profileImage) eng.addImage(profileImage, eng.contentRight - 24, eng.y, 22, 22);
  eng.setColor(eng.theme.text, "text");
  eng.doc.setFontSize(FONT.name);
  eng.doc.setFont("helvetica", "bold");
  eng.doc.text(data.personal.fullName || "Your Name", left, eng.y + 5);
  eng.y += 12;
  eng.doc.setFontSize(FONT.title);
  eng.doc.setFont("helvetica", "normal");
  eng.setColor(eng.theme.muted, "text");
  eng.doc.text(data.personal.title || data.targetRole || "", left, eng.y);
  eng.y += 10;
  eng.setColor(eng.theme.muted, "draw");
  eng.doc.setLineWidth(0.3);
  eng.doc.line(left, eng.y, eng.contentRight, eng.y);
  eng.y += 8;
  for (const item of contactItems(data).filter((i) => i.value)) {
    eng.drawContactItem(item.type, item.value, left);
  }
  if (qrUrl) eng.addQrCode(qrUrl, eng.contentRight - 14, eng.margin.top, 14);
  eng.y += 4;
}

function drawCreativeHeader(eng: ResumePdfEngine, data: ResumeData, profileImage?: string | null, qrUrl?: string | null) {
  drawModernHeader(eng, data, profileImage, qrUrl);
  eng.setColor(eng.theme.accent, "fill");
  eng.doc.rect(eng.contentLeft, eng.y - 2, 30, 2.5, "F");
  eng.y += 4;
}

function drawCorporateHeader(eng: ResumePdfEngine, data: ResumeData, profileImage?: string | null, qrUrl?: string | null) {
  eng.setColor(eng.theme.primary, "fill");
  eng.doc.rect(0, 0, PAGE.w, 6, "F");
  eng.y = eng.margin.top;

  if (profileImage) eng.addImage(profileImage, eng.margin.left, eng.y, 24, 24);

  const left = profileImage ? eng.margin.left + 30 : eng.margin.left;
  eng.setColor(eng.theme.text, "text");
  eng.doc.setFontSize(FONT.name);
  eng.doc.setFont("helvetica", "bold");
  eng.doc.text(data.personal.fullName || "Your Name", left, eng.y + 8);
  eng.setColor(eng.theme.primary, "text");
  eng.doc.setFontSize(FONT.title);
  eng.doc.setFont("helvetica", "normal");
  eng.doc.text(data.personal.title || data.targetRole || "", left, eng.y + 16);
  eng.y += 24;

  const colW = (eng.contentWidth - 10) / 2;
  let col = 0;
  for (const item of contactItems(data).filter((i) => i.value)) {
    const ix = left + col * colW;
    drawIcon(eng.doc, item.type, ix, eng.y, eng.theme.primary);
    eng.setColor(eng.theme.text, "text");
    eng.doc.setFontSize(FONT.small);
    eng.doc.text(item.value, ix + 5.5, eng.y);
    col++;
    if (col > 1) { col = 0; eng.y += 6; }
  }
  if (qrUrl) eng.addQrCode(qrUrl, eng.contentRight - 16, eng.margin.top, 16);
  eng.y += LH.section + 2;
  eng.setColor(eng.theme.light, "fill");
  eng.doc.rect(eng.margin.left, eng.y, eng.contentWidth, 1.5, "F");
  eng.y += 8;
}


const HEADERS: Record<
  ResumeData["template"],
  (eng: ResumePdfEngine, data: ResumeData, img?: string | null, qr?: string | null) => void
> = {
  modern: drawModernHeader,
  executive: drawExecutiveHeader,
  professional: drawProfessionalHeader,
  minimal: drawMinimalHeader,
  creative: drawCreativeHeader,
  corporate: drawCorporateHeader,
};

export function renderAtsSection(eng: ResumePdfEngine, ats: ATSScore) {
  eng.newPage();
  eng.drawSectionTitle("ATS Compatibility Report");
  eng.y += 2;

  eng.setColor(eng.theme.text, "text");
  eng.doc.setFontSize(FONT.name - 8);
  eng.doc.setFont("helvetica", "bold");
  eng.doc.text(`Overall ATS Score: ${ats.overall}/100`, eng.contentLeft, eng.y);
  eng.y += 10;

  const metrics = [
    ["Keyword Match", ats.keywordMatch],
    ["Formatting", ats.formatting],
    ["Completeness", ats.completeness],
    ["Action Verbs", ats.actionVerbs],
  ] as const;

  for (const [label, score] of metrics) {
    eng.ensureSpace(10);
    eng.setColor(eng.theme.text, "text");
    eng.doc.setFontSize(FONT.body);
    eng.doc.setFont("helvetica", "normal");
    eng.doc.text(`${label}: ${score}%`, eng.contentLeft, eng.y);
    const barW = eng.contentWidth * 0.55;
    const bx = eng.contentLeft + 55;
    eng.setColor(eng.theme.light, "fill");
    eng.doc.roundedRect(bx, eng.y - 3.5, barW, 4, 1, 1, "F");
    const color: [number, number, number] = score >= 80 ? [16, 185, 129] : score >= 50 ? [245, 158, 11] : [239, 68, 68];
    eng.setColor(color, "fill");
    eng.doc.roundedRect(bx, eng.y - 3.5, barW * (score / 100), 4, 1, 1, "F");
    eng.y += LH.section;
  }

  if (ats.missingSkills.length > 0) {
    eng.drawSectionTitle("Missing Keywords");
    eng.drawSkillBadges(ats.missingSkills);
  }

  if (ats.suggestions.length > 0) {
    eng.drawSectionTitle("Optimization Tips");
    eng.drawBullets(ats.suggestions);
  }

  if (ats.issues.length > 0) {
    eng.drawSectionTitle("Issues to Address");
    eng.drawBullets(ats.issues);
  }
}

export function renderResumeLayout(
  eng: ResumePdfEngine,
  data: ResumeData,
  options: { profileImage?: string | null; qrUrl?: string | null }
) {
  HEADERS[data.template](eng, data, options.profileImage, options.qrUrl);

  if (eng.theme.sidebar) {
    renderSidebarContent(eng, data, eng.theme.sidebar ? 62 : eng.margin.top);
  }

  renderMainSections(eng, data);
}
