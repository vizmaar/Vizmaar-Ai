import type { ResumeData, ATSScore } from "./types";

const ACTION_VERBS = [
  "achieved", "administered", "analyzed", "built", "collaborated", "created",
  "delivered", "designed", "developed", "directed", "drove", "enhanced",
  "established", "executed", "generated", "implemented", "improved", "increased",
  "launched", "led", "managed", "optimized", "orchestrated", "produced",
  "reduced", "resolved", "spearheaded", "streamlined", "transformed",
];

const ROLE_KEYWORDS: Record<string, string[]> = {
  "software engineer": ["javascript", "python", "react", "node", "api", "git", "agile", "sql", "testing"],
  "product manager": ["roadmap", "stakeholder", "agile", "user research", "metrics", "strategy", "prioritization"],
  "data analyst": ["sql", "python", "excel", "visualization", "statistics", "tableau", "power bi", "reporting"],
  "marketing": ["seo", "content", "campaigns", "analytics", "social media", "brand", "conversion", "crm"],
  "designer": ["figma", "ui", "ux", "prototyping", "wireframes", "design systems", "accessibility"],
  default: ["communication", "leadership", "problem solving", "teamwork", "project management", "analytical"],
};

function getRoleKeywords(targetRole: string): string[] {
  const lower = targetRole.toLowerCase();
  for (const [role, keywords] of Object.entries(ROLE_KEYWORDS)) {
    if (lower.includes(role)) return keywords;
  }
  return ROLE_KEYWORDS.default;
}

export function calculateATSScore(data: ResumeData): ATSScore {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let keywordMatch = 0;
  let formatting = 100;
  let completeness = 0;
  let actionVerbs = 0;

  const allText = [
    data.summary,
    ...data.experience.map((e) => e.description + " " + e.achievements.join(" ")),
    ...data.skills.map((s) => s.name),
    ...data.education.map((e) => e.degree + " " + e.field),
  ].join(" ").toLowerCase();

  // Completeness
  const fields = [
    data.personal.fullName, data.personal.email, data.personal.phone,
    data.summary, data.experience.length > 0, data.education.length > 0,
    data.skills.length >= 3,
  ];
  completeness = Math.round((fields.filter(Boolean).length / fields.length) * 100);
  if (!data.personal.fullName) issues.push("Missing full name");
  if (!data.personal.email) issues.push("Missing email address");
  if (!data.summary) suggestions.push("Add a professional summary (3-4 sentences)");
  if (data.experience.length === 0) issues.push("No work experience listed");
  if (data.skills.length < 3) suggestions.push("Add at least 5-10 relevant skills");

  // Keyword matching
  const keywords = getRoleKeywords(data.targetRole);
  const matched = keywords.filter((kw) => allText.includes(kw));
  const missingSkills = keywords.filter((kw) => !allText.includes(kw));
  keywordMatch = Math.round((matched.length / keywords.length) * 100);
  if (keywordMatch < 50) suggestions.push(`Add keywords: ${missingSkills.slice(0, 5).join(", ")}`);

  // Action verbs
  const verbCount = ACTION_VERBS.filter((v) => allText.includes(v)).length;
  actionVerbs = Math.min(100, Math.round((verbCount / 8) * 100));
  if (actionVerbs < 50) suggestions.push("Use strong action verbs: Led, Developed, Implemented, Achieved");

  // Formatting checks
  if (data.personal.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal.email)) {
    formatting -= 15;
    issues.push("Invalid email format");
  }
  if (data.summary.length > 600) {
    formatting -= 10;
    suggestions.push("Shorten summary to under 600 characters for ATS compatibility");
  }
  for (const exp of data.experience) {
    if (!exp.description && exp.achievements.length === 0) {
      formatting -= 5;
      issues.push(`Add bullet points for ${exp.position} at ${exp.company}`);
    }
  }

  formatting = Math.max(0, formatting);
  const overall = Math.round(keywordMatch * 0.3 + formatting * 0.25 + completeness * 0.25 + actionVerbs * 0.2);

  return { overall, keywordMatch, formatting, completeness, actionVerbs, issues, suggestions, missingSkills };
}

export function generateSummary(data: ResumeData): string {
  const title = data.personal.title || data.targetRole || "professional";
  const years = data.experience.length > 0 ? `${data.experience.length}+ years of` : "";
  const topSkills = data.skills.slice(0, 4).map((s) => s.name).join(", ");
  return `Results-driven ${title} with ${years} experience delivering measurable outcomes. Proficient in ${topSkills || "key industry tools and methodologies"}. Proven track record of ${data.achievements.length > 0 ? data.achievements[0].title.toLowerCase() : "driving innovation and exceeding targets"}. Seeking to leverage expertise to contribute to organizational success.`;
}

export function generateLinkedInSummary(data: ResumeData): string {
  const title = data.personal.title || data.targetRole || "Professional";
  const skills = data.skills.slice(0, 6).map((s) => s.name).join(" · ");
  return `🚀 ${title}\n\n${data.summary || generateSummary(data)}\n\n💡 Core Expertise: ${skills}\n\n📩 Open to opportunities — let's connect!`;
}

export function rewriteExperience(description: string): string {
  const verbs = ["Spearheaded", "Orchestrated", "Delivered", "Optimized", "Accelerated"];
  const lines = description.split(/[.\n]/).filter((l) => l.trim());
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return "";
    const verb = verbs[i % verbs.length];
    const cleaned = trimmed.replace(/^(I |We |Responsible for |Worked on )/i, "");
    return `• ${verb} ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
  }).filter(Boolean).join("\n");
}

export function suggestActionVerbs(text: string): string[] {
  const lower = text.toLowerCase();
  return ACTION_VERBS.filter((v) => !lower.includes(v)).slice(0, 8);
}

export function generateInterviewTips(data: ResumeData): string[] {
  const tips = [
    "Prepare STAR method answers for your top 3 achievements",
    "Research the company culture and recent news before the interview",
    "Prepare 3-5 thoughtful questions to ask the interviewer",
  ];
  if (data.experience.length > 0) {
    tips.push(`Be ready to discuss your role at ${data.experience[0].company} in detail`);
  }
  if (data.targetRole) {
    tips.push(`Highlight skills relevant to ${data.targetRole} throughout your answers`);
  }
  tips.push("Practice your elevator pitch — keep it under 60 seconds");
  return tips;
}

export function generateCoverLetter(data: ResumeData): string {
  const name = data.personal.fullName || "[Your Name]";
  const company = data.coverLetter.company || "[Company Name]";
  const role = data.targetRole || data.personal.title || "[Position]";
  return `Dear ${data.coverLetter.recipient || "Hiring Manager"},

I am writing to express my strong interest in the ${role} position at ${company}. With a proven background in ${data.skills.slice(0, 3).map((s) => s.name).join(", ") || "the field"}, I am confident in my ability to make an immediate and meaningful contribution to your team.

${data.summary || generateSummary(data)}

In my most recent role${data.experience[0] ? ` at ${data.experience[0].company}` : ""}, I consistently delivered results that exceeded expectations. I am particularly drawn to ${company} because of its reputation for innovation and excellence.

I would welcome the opportunity to discuss how my skills and experience align with your needs. Thank you for considering my application.

Sincerely,
${name}
${data.personal.email}
${data.personal.phone}`;
}
