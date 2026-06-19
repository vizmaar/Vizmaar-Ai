export type ResumeTemplate = "modern" | "executive" | "professional" | "minimal" | "creative" | "corporate";
export type ResumeMode = "resume" | "cv" | "cover-letter" | "linkedin";

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  title: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "basic" | "conversational" | "fluent" | "native";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface ResumePdfOptions {
  includeAtsSection?: boolean;
  includeProfileImage?: boolean;
  includeLinkedInQr?: boolean;
  profileImage?: string | null;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  skills: Skill[];
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  projects: Project[];
  achievements: Achievement[];
  references: Reference[];
  template: ResumeTemplate;
  mode: ResumeMode;
  targetRole: string;
  profileImage: string | null;
  pdfOptions: {
    includeAtsSection: boolean;
    includeProfileImage: boolean;
    includeLinkedInQr: boolean;
  };
  coverLetter: {
    recipient: string;
    company: string;
    body: string;
  };
}

export const EMPTY_RESUME: ResumeData = {
  personal: { fullName: "", email: "", phone: "", location: "", website: "", linkedin: "", title: "" },
  summary: "",
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  languages: [],
  projects: [],
  achievements: [],
  references: [],
  template: "modern",
  mode: "resume",
  targetRole: "",
  profileImage: null,
  pdfOptions: {
    includeAtsSection: true,
    includeProfileImage: true,
    includeLinkedInQr: true,
  },
  coverLetter: { recipient: "", company: "", body: "" },
};

export interface ATSScore {
  overall: number;
  keywordMatch: number;
  formatting: number;
  completeness: number;
  actionVerbs: number;
  issues: string[];
  suggestions: string[];
  missingSkills: string[];
}
