"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { mockOpportunities } from "@/data/mockData";
import { UserProfile } from "@/types";
import { FileText, CheckCircle2, AlertCircle, Sparkles, Download, ChevronRight, Edit3 } from "lucide-react";

type Mode = "original" | "optimised";

const buildCvSections = (user: UserProfile) => {
  const education = user.education.map((item) => ({
    title: item.qualification,
    institution: item.institution,
    year: item.year,
    subjects: item.field || "",
  }));
  const experience = user.experience.map((item) => ({
    title: item.title,
    company: item.company,
    duration: item.duration,
    bullets: item.description.split(/[.!?]\s+/).filter(Boolean),
  }));
  const contact = `${user.email} | ${user.location.city}`;
  const summary = `${user.name} is pursuing a career as a ${user.careerGoal}. Their profile includes ${user.skills.slice(0, 3).join(", ") || "developing skills"} and experience across education, projects, and personal background.`;

  return {
    original: { name: user.name, contact, summary, education, experience, skills: user.skills, certifications: user.certifications },
    optimised: {
      name: user.name,
      contact,
      summary: `${summary} They bring a practical, motivated approach and are ready to apply their strengths in a professional environment.`,
      education,
      experience: experience.map((item) => ({ ...item, bullets: item.bullets.map((bullet) => `Demonstrated ability to ${bullet.charAt(0).toLowerCase()}${bullet.slice(1)}`) })),
      skills: user.skills,
      certifications: user.certifications,
    },
  };
};

type SuggestionType = "warning" | "success" | "tip";

const suggestions: { type: SuggestionType; text: string }[] = [
  { type: "warning", text: "Your summary is vague — it doesn't mention any specific skills or achievements." },
  { type: "warning", text: "Your experience bullets are too generic — 'helped with computers' doesn't show impact." },
  { type: "tip", text: "Quantify your experience: how many computers? How many people did you help?" },
  { type: "tip", text: "Use stronger verbs: 'diagnosed', 'configured', 'delivered', instead of 'helped'." },
  { type: "success", text: "Good: Your Google IT Certificate is listed — make sure to add the year and provider." },
  { type: "success", text: "Good: Python and Git are skills specifically requested in this opportunity." },
];

export default function CVCoach() {
  const { user, cvChoice } = useApp();
  const [mode, setMode] = useState<Mode | null>(cvChoice === "generated" ? "optimised" : null);
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [stage, setStage] = useState<"select" | "analyse" | "result">(cvChoice === "generated" ? "result" : "select");
  const [showComparison, setShowComparison] = useState(false);

  const op = mockOpportunities.find((o) => o.id === selectedOp) ?? mockOpportunities[0];
  const cvSections = buildCvSections(user);

  if (stage === "select") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="section-heading">CV Coach</h1>
          <p className="section-sub">Tailor your CV for the opportunity you want.</p>
        </div>

        <div className="glass-card p-5 bg-brand-900/20 border-brand-700/30">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-brand-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">How it works</p>
              <p className="text-white/60 text-sm mt-1">
                Choose an opportunity. FutureWorks analyses the requirements and helps you tailor your CV to highlight the most relevant parts of your experience — without inventing anything.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-white/70 text-sm font-medium mb-3">Optimise your CV for</h2>
          <div className="space-y-3">
            {mockOpportunities.slice(0, 4).map((o) => (
              <button
                key={o.id}
                onClick={() => { setSelectedOp(o.id); setStage("analyse"); }}
                className="glass-card-hover w-full p-4 flex items-center gap-4 text-left"
              >
                <span className="text-2xl">{o.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{o.title}</p>
                  <p className="text-white/50 text-xs">{o.company}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {o.requiredSkills.slice(0, 3).map((s) => (
                      <span key={s} className="text-[10px] bg-white/10 text-white/50 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h2 className="text-white font-semibold mb-3">Quick tips</h2>
          <div className="space-y-3">
            {[
              { icon: "✅", tip: "Use strong action verbs: diagnosed, built, delivered, led, created" },
              { icon: "📊", tip: "Quantify your impact: how many? How much? How often?" },
              { icon: "🎯", tip: "Mirror the language used in the job description" },
              { icon: "🚫", tip: "Never fabricate experience or qualifications" },
            ].map(({ icon, tip }) => (
              <div key={tip} className="flex items-start gap-3">
                <span className="text-lg shrink-0">{icon}</span>
                <p className="text-white/70 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stage === "analyse") {
    return (
      <div className="space-y-5">
        <button
          onClick={() => setStage("select")}
          className="text-white/50 hover:text-white text-sm transition-colors"
        >
          ← Back
        </button>

        {/* Opportunity */}
        <div className="glass-card p-4">
          <p className="text-white/50 text-xs mb-2">Optimising for</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{op.logo}</span>
            <div>
              <p className="text-white font-semibold">{op.title}</p>
              <p className="text-white/50 text-sm">{op.company}</p>
            </div>
          </div>
        </div>

        {/* What they're looking for */}
        <div className="glass-card p-5">
          <h2 className="text-white font-semibold mb-3">What they're looking for</h2>
          <div className="flex flex-wrap gap-2">
            {op.requiredSkills.map((s) => (
              <span
                key={s}
                className={user.skills.includes(s) ? "tag-green" : "tag-red"}
              >
                {user.skills.includes(s) ? "✓" : "!"} {s}
              </span>
            ))}
          </div>
        </div>

        {/* AI analysis */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <h2 className="text-white font-semibold">CV Analysis</h2>
          </div>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                {s.type === "warning" && <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />}
                {s.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />}
                {s.type === "tip" && <Edit3 className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />}
                <p className={`text-sm ${
                  s.type === "warning" ? "text-yellow-300/80" :
                  s.type === "success" ? "text-green-300/80" : "text-white/70"
                }`}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Choose */}
        <div>
          <h2 className="text-white font-semibold mb-4">Choose your CV version</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setMode("original"); setStage("result"); }}
              className="glass-card p-4 text-left hover:bg-white/10 transition-all"
            >
              <FileText className="w-5 h-5 text-white/50 mb-2" />
              <p className="text-white font-medium text-sm">Original CV</p>
              <p className="text-white/50 text-xs mt-1">Use as it is</p>
            </button>
            <button
              onClick={() => { setMode("optimised"); setStage("result"); }}
              className={`glass-card p-4 text-left border-brand-500/50 bg-brand-900/30 hover:bg-brand-900/50 transition-all`}
            >
              <Sparkles className="w-5 h-5 text-brand-400 mb-2" />
              <p className="text-white font-medium text-sm">Optimised CV</p>
              <p className="text-white/50 text-xs mt-1">Tailored for this role</p>
              <span className="tag-blue text-[10px] mt-2 inline-flex">Recommended</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "result" && mode) {
    const cv = cvSections[mode];

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStage("analyse")}
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode(mode === "original" ? "optimised" : "original")}
              className="text-brand-400 text-xs font-medium hover:text-brand-300"
            >
              Compare →
            </button>
          </div>
        </div>

        {cvChoice === "generated" && (
          <div className="glass-card p-4 bg-green-500/10 border-green-500/30">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-green-300 font-semibold text-sm">Your ATS-friendly CV is ready</p>
                <p className="text-white/60 text-xs mt-1">Generated from the information you provided about your career goal, skills, education, and background.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setMode("original")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === "original" ? "bg-white/20 text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setMode("optimised")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === "optimised" ? "bg-brand-500/30 text-brand-300" : "text-white/40 hover:text-white/70"
            }`}
          >
            Optimised ✨
          </button>
        </div>

        {/* CV preview */}
        <div className="glass-card p-6 space-y-5">
          {/* Header */}
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-white font-bold text-xl">{cv.name}</h2>
            <p className="text-white/50 text-xs mt-1">{cv.contact}</p>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">Professional Summary</h3>
            <p className={`text-sm leading-relaxed ${mode === "optimised" ? "text-white/80" : "text-white/50"}`}>
              {cv.summary}
            </p>
            {mode === "optimised" && (
              <span className="tag-green text-[10px] mt-2 inline-flex">✓ Improved</span>
            )}
          </div>

          {/* Education */}
          <div>
            <h3 className="text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">Education</h3>
            {cv.education.map((e, i) => (
              <div key={i}>
                <p className="text-white font-medium text-sm">{e.title}</p>
                <p className="text-white/50 text-xs">{e.institution} · {e.year}</p>
                <p className="text-white/40 text-xs mt-0.5">{e.subjects}</p>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">Experience</h3>
            {cv.experience.map((e, i) => (
              <div key={i}>
                <p className="text-white font-medium text-sm">{e.title}</p>
                <p className="text-white/50 text-xs">{e.company} · {e.duration}</p>
                <ul className="mt-2 space-y-1.5">
                  {e.bullets.map((b, bi) => (
                    <li key={bi} className={`text-xs flex items-start gap-2 ${
                      mode === "optimised" ? "text-white/70" : "text-white/40"
                    }`}>
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                {mode === "optimised" && (
                  <span className="tag-green text-[10px] mt-2 inline-flex">✓ Quantified & strengthened</span>
                )}
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((s) => (
                <span key={s} className="bg-white/10 text-white/70 text-xs px-2.5 py-1 rounded-lg">{s}</span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">Certifications</h3>
            {cv.certifications.map((c, i) => (
              <p key={i} className="text-white/70 text-xs">{c}</p>
            ))}
          </div>
        </div>

        <button className="btn-primary w-full flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Download {mode === "optimised" ? "Optimised" : "Original"} CV
        </button>

        {mode === "optimised" && (
          <div className="glass-card p-4 bg-green-500/10 border-green-500/30">
            <p className="text-green-400 font-medium text-sm mb-1">🎉 Your CV is ready</p>
            <p className="text-white/60 text-xs">
              {cvChoice === "generated"
                ? `This version is structured for applicant tracking systems and highlights your ${user.careerGoal || "target career"} direction.`
                : `This version highlights the experience and skills most relevant to what ${op.company} is looking for.`}
            </p>
          </div>
        )}

        <div className="h-4" />
      </div>
    );
  }

  return null;
}
