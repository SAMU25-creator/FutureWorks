"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { CheckCircle2, Circle, ChevronRight, ExternalLink, Star, Clock } from "lucide-react";

interface LearningStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  resources: { title: string; provider: string; free: boolean; url?: string }[];
  completed: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  estimatedTime: string;
  skillsNeeded: string[];
  steps: LearningStep[];
}

const learningPaths: LearningPath[] = [
  {
    id: "data-analyst",
    title: "Data Analyst",
    description: "Analyse data to generate business insights",
    icon: "📊",
    color: "from-violet-600 to-purple-600",
    estimatedTime: "8-10 weeks",
    skillsNeeded: ["SQL", "Data Visualisation"],
    steps: [
      {
        id: "s1",
        title: "SQL Fundamentals",
        description: "Learn to query databases, use joins and aggregations",
        duration: "3-4 weeks",
        resources: [
          { title: "SQL Tutorial", provider: "W3Schools", free: true, url: "#" },
          { title: "SQL for Data Analysis", provider: "DataCamp", free: false, url: "#" },
          { title: "Intro to SQL", provider: "Khan Academy", free: true, url: "#" },
        ],
        completed: false,
      },
      {
        id: "s2",
        title: "Data Visualisation",
        description: "Create charts, dashboards and visual reports",
        duration: "2-3 weeks",
        resources: [
          { title: "Google Data Studio", provider: "Google", free: true, url: "#" },
          { title: "Power BI Basics", provider: "Microsoft Learn", free: true, url: "#" },
        ],
        completed: false,
      },
      {
        id: "s3",
        title: "Build a Data Project",
        description: "Analyse a public dataset and build a dashboard",
        duration: "2 weeks",
        resources: [
          { title: "Kaggle Datasets", provider: "Kaggle", free: true, url: "#" },
        ],
        completed: false,
      },
      {
        id: "s4",
        title: "Add to Portfolio",
        description: "Upload your project to GitHub and update your profile",
        duration: "2 hours",
        resources: [],
        completed: false,
      },
      {
        id: "s5",
        title: "Apply for relevant opportunities",
        description: "Your profile is now ready for Data Analyst roles",
        duration: "1 hour",
        resources: [],
        completed: false,
      },
    ],
  },
  {
    id: "software-dev",
    title: "Software Developer",
    description: "Build applications and software systems",
    icon: "💻",
    color: "from-blue-600 to-indigo-600",
    estimatedTime: "6-8 weeks",
    skillsNeeded: ["Java"],
    steps: [
      {
        id: "s1",
        title: "Java Fundamentals",
        description: "Learn OOP with Java — classes, inheritance, exceptions",
        duration: "2-3 weeks",
        resources: [
          { title: "Java Programming MOOC", provider: "University of Helsinki", free: true, url: "#" },
          { title: "Java for Beginners", provider: "Udemy", free: false, url: "#" },
        ],
        completed: false,
      },
      {
        id: "s2",
        title: "Build a Small Java Project",
        description: "Create a task manager or calculator app",
        duration: "1 week",
        resources: [{ title: "Project Ideas", provider: "GitHub", free: true, url: "#" }],
        completed: false,
      },
      {
        id: "s3",
        title: "Practise Interview",
        description: "Use the AI Interview Coach to prepare",
        duration: "30 mins",
        resources: [],
        completed: false,
      },
      {
        id: "s4",
        title: "Optimise CV",
        description: "Use the CV Coach to tailor your CV",
        duration: "20 mins",
        resources: [],
        completed: false,
      },
      {
        id: "s5",
        title: "Apply",
        description: "Ready to apply for Junior Developer roles",
        duration: "15 mins",
        resources: [],
        completed: false,
      },
    ],
  },
  {
    id: "ui-ux",
    title: "UI/UX Designer",
    description: "Design beautiful, user-centred digital products",
    icon: "🎨",
    color: "from-pink-600 to-rose-600",
    estimatedTime: "8-12 weeks",
    skillsNeeded: ["Figma", "Design Thinking", "Prototyping"],
    steps: [
      {
        id: "s1",
        title: "Figma Essentials",
        description: "Frames, components, auto-layout, and prototyping",
        duration: "2 weeks",
        resources: [
          { title: "Figma Academy", provider: "Figma", free: true, url: "#" },
          { title: "Google UX Design Certificate", provider: "Coursera", free: false, url: "#" },
        ],
        completed: false,
      },
      {
        id: "s2",
        title: "Design Thinking & UX Research",
        description: "User interviews, personas, journey mapping",
        duration: "2 weeks",
        resources: [
          { title: "Design Thinking", provider: "IDEO U", free: true, url: "#" },
        ],
        completed: false,
      },
      {
        id: "s3",
        title: "Build Design Portfolio",
        description: "Design 3 app screens and publish to Behance/Dribbble",
        duration: "3 weeks",
        resources: [
          { title: "Behance", provider: "Adobe", free: true, url: "#" },
        ],
        completed: false,
      },
      {
        id: "s4",
        title: "Apply for Design Roles",
        description: "Portfolio ready — apply for apprenticeships and internships",
        duration: "1 hour",
        resources: [],
        completed: false,
      },
    ],
  },
];

function ExpandableStep({
  step,
  done,
  index,
  onToggle,
}: {
  step: LearningStep;
  done: boolean;
  index: number;
  total: number;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`glass-card overflow-hidden transition-all ${done ? "opacity-70" : ""}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 text-left"
      >
        <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="shrink-0">
          {done
            ? <CheckCircle2 className="w-6 h-6 text-green-400" />
            : <Circle className="w-6 h-6 text-white/30" />
          }
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs font-bold w-5">{String(index + 1).padStart(2, "0")}</span>
            <p className={`text-sm font-medium ${done ? "line-through text-white/40" : "text-white"}`}>
              {step.title}
            </p>
          </div>
          <p className="text-white/50 text-xs mt-0.5 ml-7">{step.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-white/40 text-xs">{step.duration}</span>
          <ChevronRight className={`w-4 h-4 text-white/30 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
      </button>

      {expanded && step.resources.length > 0 && (
        <div className="px-4 pb-4 ml-9 border-t border-white/10 pt-3">
          <p className="text-white/50 text-xs mb-2">Learning resources</p>
          <div className="space-y-2">
            {step.resources.map((r, ri) => (
              <a
                key={ri}
                href={r.url}
                className="flex items-center gap-3 glass-card-hover p-3 text-sm"
              >
                <div className="flex-1">
                  <p className="text-white font-medium">{r.title}</p>
                  <p className="text-white/50 text-xs">{r.provider}</p>
                </div>
                <div className="flex items-center gap-2">
                  {r.free
                    ? <span className="tag-green text-[10px]">Free</span>
                    : <span className="tag-yellow text-[10px]">Paid</span>
                  }
                  <ExternalLink className="w-3.5 h-3.5 text-white/30" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Upskill() {
  const { user, setActiveTab } = useApp();
  const [activePath, setActivePath] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const currentPath = learningPaths.find((p) => p.id === activePath);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  if (currentPath) {
    const doneCount = currentPath.steps.filter((s) => completedSteps[s.id]).length;
    const pct = Math.round((doneCount / currentPath.steps.length) * 100);

    return (
      <div className="space-y-5">
        <button
          onClick={() => setActivePath(null)}
          className="text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors"
        >
          ← Back to pathways
        </button>

        {/* Path header */}
        <div className={`glass-card p-6 bg-gradient-to-br ${currentPath.color} bg-opacity-20`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{currentPath.icon}</span>
            <div>
              <h1 className="text-white font-bold text-2xl">{currentPath.title}</h1>
              <p className="text-white/70 text-sm">{currentPath.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {currentPath.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" /> {currentPath.steps.length} steps
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">Progress</span>
            <span className="text-white font-semibold">{doneCount}/{currentPath.steps.length}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {currentPath.steps.map((step, i) => (
            <ExpandableStep
              key={step.id}
              step={step}
              done={!!completedSteps[step.id]}
              index={i}
              total={currentPath.steps.length}
              onToggle={() => toggleStep(step.id)}
            />
          ))}
        </div>

        {pct === 100 && (
          <div className="glass-card p-5 bg-green-500/10 border-green-500/30 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-green-400 font-bold text-lg">Learning path complete!</p>
            <p className="text-white/60 text-sm mt-1">
              You&apos;re ready to apply for {currentPath.title} opportunities.
            </p>
            <button
              onClick={() => setActiveTab("discover")}
              className="btn-success mt-4"
            >
              Find opportunities →
            </button>
          </div>
        )}

        <div className="h-4" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-heading">Upskill</h1>
        <p className="section-sub">Personalised learning paths to close your skill gaps</p>
      </div>

      {/* Recommended */}
      <div className="glass-card p-4 border-brand-700/40 bg-brand-900/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="text-white font-semibold text-sm">Based on your profile</p>
            <p className="text-white/60 text-xs mt-1">
              You&apos;re targeting <span className="text-brand-300">{user.careerGoal}</span>. Here are
              the skills you need to develop to qualify for the best matching opportunities.
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(user.skills.length < 3
            ? ["Communication", "Industry knowledge", "Digital confidence"]
            : ["Leadership", "Problem-solving", "Interview preparation"]
          ).map((skill) => (
            <span key={skill} className="tag-red">{skill}</span>
          ))}
        </div>
      </div>

      {/* Learning paths */}
      <div className="space-y-4">
        {learningPaths.map((lp) => {
          const doneCount = lp.steps.filter((s) => completedSteps[s.id]).length;
          const pct = Math.round((doneCount / lp.steps.length) * 100);

          return (
            <button
              key={lp.id}
              onClick={() => setActivePath(lp.id)}
              className="glass-card-hover w-full p-5 text-left"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lp.color} flex items-center justify-center text-2xl shrink-0`}>
                  {lp.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{lp.title}</h3>
                      <p className="text-white/60 text-sm mt-0.5">{lp.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 shrink-0 mt-0.5" />
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {lp.estimatedTime}
                    </span>
                    <span>{lp.steps.length} steps</span>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/40 text-xs">Progress</span>
                      <span className="text-white/60 text-xs">{doneCount}/{lp.steps.length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {lp.skillsNeeded.map((s) => (
                      <span key={s} className="tag-red text-[10px]">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="h-4" />
    </div>
  );
}
