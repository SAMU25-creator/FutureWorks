export type OpportunityType =
  | "job"
  | "internship"
  | "learnership"
  | "apprenticeship"
  | "bursary"
  | "course"
  | "programme";

export type MatchStatus = "ready" | "close" | "build-towards";

export interface Skill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced";
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  qualification: string;
  institution: string;
  year: string;
  field?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  location: {
    city: string;
    lat: number;
    lng: number;
  };
  education: Education[];
  skills: string[];
  certifications: string[];
  experience: Experience[];
  interests: string[];
  careerGoal: string;
  profileComplete: number;
  coursesCompleted: number;
  applicationsCount: number;
  interviewReadiness: number;
}

export interface LearningResource {
  title: string;
  provider: string;
  duration: string;
  free: boolean;
  url?: string;
}

export interface SkillGap {
  skill: string;
  priority: "high" | "medium" | "low";
  resources: LearningResource[];
}

export interface PathwayStep {
  id: string;
  title: string;
  description: string;
  type: "learn" | "build" | "practice" | "apply";
  completed: boolean;
  duration?: string;
  location?: string;
  distanceKm?: number;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: OpportunityType;
  location: string;
  lat: number;
  lng: number;
  distanceKm: number;
  matchScore: number;
  matchStatus: MatchStatus;
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
  stipend?: string;
  deadline: string;
  logo: string;
  color: string;
  skillsYouHave: string[];
  skillsYouNeed: string[];
  pathway: PathwayStep[];
  industry: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: "general" | "technical" | "behavioural" | "situational";
  hint: string;
  model_answer: string;
}

export interface InterviewFeedback {
  structure: number;
  relevance: number;
  clarity: number;
  confidence: number;
  overall: number;
  strengths: string[];
  improvements: string[];
  tip: string;
}

export type SwipeDecision = "right" | "left" | "super";

export interface SwipedCard {
  opportunity: Opportunity;
  decision: SwipeDecision;
}
