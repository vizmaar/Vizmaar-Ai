"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Trash2, Download, Printer, Sparkles, FileText, Briefcase,
  GraduationCap, Award, Globe, FolderOpen, Star, Users, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ToolLayout } from "./ToolLayout";
import { saveToHistory, saveDraft, loadDraft } from "@/lib/storage";
import { exportResumePDF, exportCoverLetterPDF } from "@/lib/resume/pdf-export";
import {
  calculateATSScore, generateSummary, generateLinkedInSummary,
  rewriteExperience, suggestActionVerbs, generateInterviewTips, generateCoverLetter,
} from "@/lib/resume/ats-scorer";
import type { ResumeData, ResumeTemplate, ResumeMode, Language } from "@/lib/resume/types";
import { EMPTY_RESUME } from "@/lib/resume/types";

const TEMPLATES: { id: ResumeTemplate; label: string }[] = [
  { id: "modern", label: "Modern" },
  { id: "executive", label: "Executive" },
  { id: "professional", label: "Professional" },
  { id: "minimal", label: "Minimal" },
  { id: "creative", label: "Creative" },
  { id: "corporate", label: "Corporate" },
];

const MODES: { id: ResumeMode; label: string }[] = [
  { id: "resume", label: "Resume" },
  { id: "cv", label: "CV" },
  { id: "cover-letter", label: "Cover Letter" },
  { id: "linkedin", label: "LinkedIn" },
];

const SECTIONS = [
  { id: "personal", label: "Personal Info", icon: Users },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Star },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "languages", label: "Languages", icon: Globe },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "achievements", label: "Achievements", icon: Star },
  { id: "references", label: "References", icon: Users },
  { id: "ats", label: "ATS Score", icon: Sparkles },
] as const;

type SectionId = typeof SECTIONS[number]["id"];

function uid() { return Math.random().toString(36).slice(2, 9); }

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(EMPTY_RESUME);
  const [section, setSection] = useState<SectionId>("personal");
  const [tips, setTips] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const draft = loadDraft<ResumeData>("resume");
    if (draft) {
      setData({
        ...EMPTY_RESUME,
        ...draft,
        personal: { ...EMPTY_RESUME.personal, ...draft.personal },
        pdfOptions: { ...EMPTY_RESUME.pdfOptions, ...draft.pdfOptions },
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => saveDraft("resume", data), 1000);
    return () => clearTimeout(timer);
  }, [data]);

  const update = useCallback(<K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const ats = calculateATSScore(data);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      if (data.mode === "cover-letter") {
        await exportCoverLetterPDF(data, data.coverLetter.body || generateCoverLetter(data));
      } else {
        await exportResumePDF(data, {
          includeAtsSection: data.pdfOptions.includeAtsSection,
          includeProfileImage: data.pdfOptions.includeProfileImage,
          includeLinkedInQr: data.pdfOptions.includeLinkedInQr,
          profileImage: data.profileImage,
        });
      }
      saveToHistory("resume", { name: data.personal.fullName, template: data.template, date: new Date().toISOString() });
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    handleExportPDF();
  };

  return (
    <ToolLayout wide>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <nav className="lg:w-48 shrink-0 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                section === id ? "bg-brand-light text-brand" : "text-muted hover:bg-surface-hover hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {id === "ats" && <Badge className="ml-auto text-xs">{ats.overall}</Badge>}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Mode & Template selectors */}
          <div className="flex flex-wrap gap-4">
            <div>
              <Label className="text-xs text-muted mb-1 block">Mode</Label>
              <div className="flex flex-wrap gap-1">
                {MODES.map((m) => (
                  <button key={m.id} type="button" onClick={() => update("mode", m.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${data.mode === m.id ? "border-brand bg-brand-light text-brand" : "border-border text-muted"}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted mb-1 block">Template</Label>
              <div className="flex flex-wrap gap-1">
                {TEMPLATES.map((t) => (
                  <button key={t.id} type="button" onClick={() => update("template", t.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${data.template === t.id ? "border-brand bg-brand-light text-brand" : "border-border text-muted"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {section === "personal" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  ["fullName", "Full Name", "text"], ["title", "Professional Title", "text"],
                  ["email", "Email", "email"], ["phone", "Phone", "tel"],
                  ["location", "Location", "text"], ["website", "Website", "url"],
                  ["linkedin", "LinkedIn", "url"], ["targetRole", "Target Role (for ATS)", "text"],
                ] as const).map(([key, label, type]) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Input type={type} value={key === "targetRole" ? data.targetRole : data.personal[key]}
                      onChange={(e) => key === "targetRole" ? update("targetRole", e.target.value) : update("personal", { ...data.personal, [key]: e.target.value })} />
                  </div>
                ))}
              </div>

              <div>
                <Label>Profile Photo (optional)</Label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => update("profileImage", reader.result as string);
                    reader.readAsDataURL(file);
                  }}
                />
                {data.profileImage && (
                  <div className="mt-3 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.profileImage} alt="Profile" className="h-20 w-20 rounded-full object-cover border-2 border-border" />
                    <Button variant="ghost" size="sm" onClick={() => update("profileImage", null)}>Remove photo</Button>
                  </div>
                )}
              </div>

              <fieldset className="p-4 rounded-lg border border-border space-y-3">
                <legend className="text-sm font-semibold px-1">PDF Export Options</legend>
                {([
                  ["includeAtsSection", "Include ATS Score report page"],
                  ["includeProfileImage", "Include profile photo in PDF"],
                  ["includeLinkedInQr", "Include LinkedIn QR code"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.pdfOptions[key]}
                      onChange={(e) => update("pdfOptions", { ...data.pdfOptions, [key]: e.target.checked })}
                      className="rounded border-border text-brand focus:ring-brand"
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
            </div>
          )}

          {section === "summary" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Professional Summary</Label>
                <Button variant="secondary" size="sm" onClick={() => update("summary", generateSummary(data))}>
                  <Sparkles className="h-3.5 w-3.5" /> AI Generate
                </Button>
              </div>
              <Textarea value={data.summary} onChange={(e) => update("summary", e.target.value)}
                placeholder="Write a compelling 3-4 sentence professional summary..." rows={5} />
              {data.mode === "linkedin" && (
                <div>
                  <Button variant="secondary" size="sm" onClick={() => update("summary", generateLinkedInSummary(data))}>
                    Generate LinkedIn Summary
                  </Button>
                </div>
              )}
            </div>
          )}

          {section === "experience" && (
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={exp.id} className="p-4 rounded-lg border border-border space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Experience #{i + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => update("experience", data.experience.filter((e) => e.id !== exp.id))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label>Position</Label><Input value={exp.position} onChange={(e) => {
                      const updated = [...data.experience]; updated[i] = { ...exp, position: e.target.value }; update("experience", updated);
                    }} /></div>
                    <div><Label>Company</Label><Input value={exp.company} onChange={(e) => {
                      const updated = [...data.experience]; updated[i] = { ...exp, company: e.target.value }; update("experience", updated);
                    }} /></div>
                    <div><Label>Start Date</Label><Input type="month" value={exp.startDate} onChange={(e) => {
                      const updated = [...data.experience]; updated[i] = { ...exp, startDate: e.target.value }; update("experience", updated);
                    }} /></div>
                    <div><Label>End Date</Label><Input type="month" value={exp.endDate} disabled={exp.current} onChange={(e) => {
                      const updated = [...data.experience]; updated[i] = { ...exp, endDate: e.target.value }; update("experience", updated);
                    }} /></div>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={exp.current} onChange={(e) => {
                      const updated = [...data.experience]; updated[i] = { ...exp, current: e.target.checked }; update("experience", updated);
                    }} /> Currently working here
                  </label>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label>Description</Label>
                      <Button variant="ghost" size="sm" onClick={() => {
                        const updated = [...data.experience];
                        updated[i] = { ...exp, description: rewriteExperience(exp.description) };
                        update("experience", updated);
                      }}><Sparkles className="h-3.5 w-3.5" /> AI Rewrite</Button>
                    </div>
                    <Textarea value={exp.description} onChange={(e) => {
                      const updated = [...data.experience]; updated[i] = { ...exp, description: e.target.value }; update("experience", updated);
                    }} rows={3} />
                  </div>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => update("experience", [...data.experience, {
                id: uid(), company: "", position: "", startDate: "", endDate: "", current: false, description: "", achievements: [],
              }])}><Plus className="h-4 w-4" /> Add Experience</Button>
            </div>
          )}

          {section === "education" && (
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={edu.id} className="p-4 rounded-lg border border-border space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Education #{i + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => update("education", data.education.filter((e) => e.id !== edu.id))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([["institution", "Institution"], ["degree", "Degree"], ["field", "Field of Study"], ["gpa", "GPA"]] as const).map(([key, label]) => (
                      <div key={key}><Label>{label}</Label><Input value={edu[key]} onChange={(e) => {
                        const updated = [...data.education]; updated[i] = { ...edu, [key]: e.target.value }; update("education", updated);
                      }} /></div>
                    ))}
                  </div>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => update("education", [...data.education, {
                id: uid(), institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "",
              }])}><Plus className="h-4 w-4" /> Add Education</Button>
            </div>
          )}

          {section === "skills" && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Add a skill..." id="skill-input" onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const input = e.currentTarget;
                    if (input.value.trim()) {
                      update("skills", [...data.skills, { id: uid(), name: input.value.trim(), level: "intermediate" }]);
                      input.value = "";
                    }
                  }
                }} />
                <Button variant="secondary" size="sm" onClick={() => {
                  const input = document.getElementById("skill-input") as HTMLInputElement;
                  if (input?.value.trim()) {
                    update("skills", [...data.skills, { id: uid(), name: input.value.trim(), level: "intermediate" }]);
                    input.value = "";
                  }
                }}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span key={skill.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-light text-brand text-sm">
                    {skill.name}
                    <button type="button" onClick={() => update("skills", data.skills.filter((s) => s.id !== skill.id))} className="hover:text-error">×</button>
                  </span>
                ))}
              </div>
              {data.targetRole && (
                <div className="text-xs text-muted">
                  Suggested verbs: {suggestActionVerbs(data.summary).join(", ")}
                </div>
              )}
            </div>
          )}

          {section === "certifications" && (
            <div className="space-y-4">
              {data.certifications.map((cert, i) => (
                <div key={cert.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg border border-border">
                  <Input placeholder="Certification name" value={cert.name} onChange={(e) => {
                    const updated = [...data.certifications]; updated[i] = { ...cert, name: e.target.value }; update("certifications", updated);
                  }} />
                  <Input placeholder="Issuer" value={cert.issuer} onChange={(e) => {
                    const updated = [...data.certifications]; updated[i] = { ...cert, issuer: e.target.value }; update("certifications", updated);
                  }} />
                  <div className="flex gap-2">
                    <Input type="month" value={cert.date} onChange={(e) => {
                      const updated = [...data.certifications]; updated[i] = { ...cert, date: e.target.value }; update("certifications", updated);
                    }} />
                    <Button variant="ghost" size="sm" onClick={() => update("certifications", data.certifications.filter((c) => c.id !== cert.id))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => update("certifications", [...data.certifications, { id: uid(), name: "", issuer: "", date: "" }])}>
                <Plus className="h-4 w-4" /> Add Certification
              </Button>
            </div>
          )}

          {section === "languages" && (
            <div className="space-y-3">
              {data.languages.map((lang, i) => (
                <div key={lang.id} className="flex gap-2">
                  <Input placeholder="Language" value={lang.name} className="flex-1" onChange={(e) => {
                    const updated = [...data.languages]; updated[i] = { ...lang, name: e.target.value }; update("languages", updated);
                  }} />
                  <select value={lang.proficiency} onChange={(e) => {
                    const updated = [...data.languages]; updated[i] = { ...lang, proficiency: e.target.value as Language["proficiency"] }; update("languages", updated);
                  }} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                    <option value="basic">Basic</option><option value="conversational">Conversational</option>
                    <option value="fluent">Fluent</option><option value="native">Native</option>
                  </select>
                  <Button variant="ghost" size="sm" onClick={() => update("languages", data.languages.filter((l) => l.id !== lang.id))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => update("languages", [...data.languages, { id: uid(), name: "", proficiency: "conversational" }])}>
                <Plus className="h-4 w-4" /> Add Language
              </Button>
            </div>
          )}

          {section === "projects" && (
            <div className="space-y-4">
              {data.projects.map((proj, i) => (
                <div key={proj.id} className="p-4 rounded-lg border border-border space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{proj.name || `Project #${i + 1}`}</span>
                    <Button variant="ghost" size="sm" onClick={() => update("projects", data.projects.filter((p) => p.id !== proj.id))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input placeholder="Project name" value={proj.name} onChange={(e) => {
                    const updated = [...data.projects]; updated[i] = { ...proj, name: e.target.value }; update("projects", updated);
                  }} />
                  <Textarea placeholder="Description" value={proj.description} onChange={(e) => {
                    const updated = [...data.projects]; updated[i] = { ...proj, description: e.target.value }; update("projects", updated);
                  }} rows={2} />
                  <Input placeholder="URL" value={proj.url} onChange={(e) => {
                    const updated = [...data.projects]; updated[i] = { ...proj, url: e.target.value }; update("projects", updated);
                  }} />
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => update("projects", [...data.projects, { id: uid(), name: "", description: "", url: "", technologies: [] }])}>
                <Plus className="h-4 w-4" /> Add Project
              </Button>
            </div>
          )}

          {section === "achievements" && (
            <div className="space-y-3">
              {data.achievements.map((ach, i) => (
                <div key={ach.id} className="flex gap-2">
                  <Input placeholder="Achievement title" value={ach.title} className="flex-1" onChange={(e) => {
                    const updated = [...data.achievements]; updated[i] = { ...ach, title: e.target.value }; update("achievements", updated);
                  }} />
                  <Button variant="ghost" size="sm" onClick={() => update("achievements", data.achievements.filter((a) => a.id !== ach.id))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => update("achievements", [...data.achievements, { id: uid(), title: "", description: "" }])}>
                <Plus className="h-4 w-4" /> Add Achievement
              </Button>
            </div>
          )}

          {section === "references" && (
            <div className="space-y-4">
              {data.references.map((ref, i) => (
                <div key={ref.id} className="p-4 rounded-lg border border-border grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {([["name", "Name"], ["title", "Title"], ["company", "Company"], ["email", "Email"], ["phone", "Phone"]] as const).map(([key, label]) => (
                    <div key={key}><Label>{label}</Label><Input value={ref[key]} onChange={(e) => {
                      const updated = [...data.references]; updated[i] = { ...ref, [key]: e.target.value }; update("references", updated);
                    }} /></div>
                  ))}
                  <div className="sm:col-span-2 flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => update("references", data.references.filter((r) => r.id !== ref.id))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => update("references", [...data.references, { id: uid(), name: "", title: "", company: "", email: "", phone: "" }])}>
                <Plus className="h-4 w-4" /> Add Reference
              </Button>
            </div>
          )}

          {section === "ats" && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <ScoreRing score={ats.overall} label="ATS Score" size="lg" />
                <div className="flex-1 space-y-3">
                  <ProgressBar value={ats.keywordMatch} label="Keyword Match" />
                  <ProgressBar value={ats.formatting} label="Formatting" />
                  <ProgressBar value={ats.completeness} label="Completeness" />
                  <ProgressBar value={ats.actionVerbs} label="Action Verbs" />
                </div>
              </div>
              {ats.issues.length > 0 && (
                <div className="rounded-lg border border-error/30 bg-error/5 p-4">
                  <h4 className="text-sm font-semibold text-error mb-2">Issues</h4>
                  <ul className="space-y-1">{ats.issues.map((issue, i) => (
                    <li key={i} className="text-sm text-error flex items-start gap-2"><ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />{issue}</li>
                  ))}</ul>
                </div>
              )}
              {ats.suggestions.length > 0 && (
                <div className="rounded-lg border border-brand/30 bg-brand-light/30 p-4">
                  <h4 className="text-sm font-semibold text-brand mb-2">AI Suggestions</h4>
                  <ul className="space-y-1">{ats.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2"><Sparkles className="h-4 w-4 text-brand shrink-0 mt-0.5" />{s}</li>
                  ))}</ul>
                </div>
              )}
              {ats.missingSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {ats.missingSkills.map((s) => <Badge key={s}>{s}</Badge>)}
                  </div>
                </div>
              )}
              <Button variant="secondary" size="sm" onClick={() => setTips(generateInterviewTips(data))}>
                <Sparkles className="h-3.5 w-3.5" /> Generate Interview Tips
              </Button>
              {tips.length > 0 && (
                <ul className="space-y-2">{tips.map((tip, i) => (
                  <li key={i} className="text-sm text-muted flex gap-2"><ChevronRight className="h-4 w-4 text-brand shrink-0" />{tip}</li>
                ))}</ul>
              )}
            </div>
          )}

          {data.mode === "cover-letter" && section !== "ats" && (
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <Label>Cover Letter</Label>
                <Button variant="secondary" size="sm" onClick={() => update("coverLetter", { ...data.coverLetter, body: generateCoverLetter(data) })}>
                  <Sparkles className="h-3.5 w-3.5" /> AI Generate
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Recipient name" value={data.coverLetter.recipient} onChange={(e) => update("coverLetter", { ...data.coverLetter, recipient: e.target.value })} />
                <Input placeholder="Company name" value={data.coverLetter.company} onChange={(e) => update("coverLetter", { ...data.coverLetter, company: e.target.value })} />
              </div>
              <Textarea value={data.coverLetter.body || generateCoverLetter(data)} onChange={(e) => update("coverLetter", { ...data.coverLetter, body: e.target.value })} rows={12} />
            </div>
          )}

          {/* Export bar */}
          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <Button onClick={handleExportPDF} disabled={exporting}>
              <Download className="h-4 w-4" /> {exporting ? "Generating PDF..." : "Download PDF"}
            </Button>
            <Button variant="outline" onClick={handlePrint} disabled={exporting}><Printer className="h-4 w-4" /> Print</Button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}