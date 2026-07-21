export type Lang = "fr" | "en";

export type SkillLevel = "expert" | "advanced" | "solid";

export type StackGroupKey = "frontend" | "backend" | "monitoring" | "ai";

export interface SkillItem {
  name: string;
  level: SkillLevel;
}

export interface StackGroup {
  key: StackGroupKey;
  items: SkillItem[];
}

export interface ExperiencePoint {
  label: string;
  text: string;
}

export interface Experience {
  index: string;
  company: string;
  role: string;
  place: string;
  period: string;
  summary: string;
  points: ExperiencePoint[];
}

export interface Translation {
  heroRole: string;
  heroTag: string;
  heroAvail: string;
  heroSince: string;
  heroLangs: string;
  heroPitch: string;
  loadingLabel: string;
  expTitle: string;
  stackTitle: string;
  contactLabel: string;
  contactTitle: string;
  contactSub: string;
  contactAvail: string;
  contactReply: string;
  cvLabel: string;
  copyLabel: string;
  copiedLabel: string;
  localLabel: string;
  footerNote: string;
  groupLabels: Record<StackGroupKey, string>;
  levelLabels: Record<SkillLevel, string>;
  experiences: Experience[];
}
