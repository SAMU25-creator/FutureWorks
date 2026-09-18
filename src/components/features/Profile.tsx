"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import {
  User,
  Briefcase,
  GraduationCap,
  Zap,
  Award,
  Target,
  Plus,
  X,
  Check,
  MapPin,
  Edit3,
  Upload,
} from "lucide-react";

const INTEREST_OPTIONS = [
  "Technology", "Creativity", "Problem Solving", "Data & Analytics",
  "Design", "Leadership", "Communication", "Finance", "Healthcare",
  "Education", "Science", "Business",
];

const SKILL_SUGGESTIONS = [
  "Python", "JavaScript", "Java", "SQL", "HTML/CSS", "React",
  "Git", "Excel", "Data Analysis", "Communication", "Teamwork",
  "Problem-solving", "Figma", "Node.js", "TypeScript",
];

export default function Profile() {
  const { user, setUser, setActiveTab, setProfileSetupDone } = useApp();
  const [editSection, setEditSection] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);

  const addSkill = (skill: string) => {
    if (!user.skills.includes(skill) && skill.trim()) {
      setUser({ ...user, skills: [...user.skills, skill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setUser({ ...user, skills: user.skills.filter((s) => s !== skill) });
  };

  const toggleInterest = (interest: string) => {
    const has = user.interests.includes(interest);
    setUser({
      ...user,
      interests: has
        ? user.interests.filter((i) => i !== interest)
        : [...user.interests, interest],
    });
  };

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditSection(null);
      setProfileSetupDone(true);
    }, 800);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-heading">Your Profile</h1>
          <p className="section-sub">The foundation of your career journey</p>
        </div>
      </div>

      {/* Profile header */}
      <div className="glass-card p-6 bg-gradient-to-br from-brand-900/60 to-purple-900/40">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
            {user.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1">
            <h2 className="text-white font-bold text-xl">{user.name}</h2>
            <p className="text-white/60 text-sm flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {user.location.city}
            </p>
            <p className="text-brand-300 text-sm mt-0.5">🎯 {user.careerGoal}</p>
          </div>
          <button
            onClick={() => setEditSection("basic")}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
          >
            <Edit3 className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Profile completeness */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">Profile completeness</span>
            <span className="text-brand-300 font-semibold">{user.profileComplete}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${user.profileComplete}%` }} />
          </div>
          {user.profileComplete < 100 && (
            <p className="text-white/40 text-xs mt-1.5">
              Add more skills or experience to complete your profile
            </p>
          )}
        </div>
      </div>

      {/* CV Upload */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
              <Upload className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Upload your CV</p>
              <p className="text-white/50 text-xs">PDF or Word document</p>
            </div>
          </div>
          <button className="btn-secondary py-2 px-4 text-sm">Upload</button>
        </div>
      </div>

      {/* Skills */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h2 className="text-white font-semibold">Skills</h2>
            <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded-full">{user.skills.length}</span>
          </div>
          <button
            onClick={() => setEditSection(editSection === "skills" ? null : "skills")}
            className="text-brand-400 text-xs font-medium"
          >
            {editSection === "skills" ? "Done" : "Edit"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {user.skills.map((skill) => (
            <span key={skill} className="flex items-center gap-1.5 bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-medium px-2.5 py-1 rounded-full">
              {skill}
              {editSection === "skills" && (
                <button onClick={() => removeSkill(skill)}>
                  <X className="w-3 h-3 text-brand-400 hover:text-red-400" />
                </button>
              )}
            </span>
          ))}
        </div>

        {editSection === "skills" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill(newSkill)}
                placeholder="Add a skill..."
                className="input-field text-sm py-2 flex-1"
              />
              <button
                onClick={() => addSkill(newSkill)}
                className="w-10 h-10 rounded-xl bg-brand-500/30 border border-brand-500/40 flex items-center justify-center hover:bg-brand-500/50 transition-all"
              >
                <Plus className="w-4 h-4 text-brand-300" />
              </button>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-2">Quick add</p>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_SUGGESTIONS.filter((s) => !user.skills.includes(s)).map((s) => (
                  <button
                    key={s}
                    onClick={() => addSkill(s)}
                    className="text-xs bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80 px-2 py-1 rounded-lg transition-all"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Education */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-brand-400" />
          <h2 className="text-white font-semibold">Education</h2>
        </div>
        {user.education.map((edu, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <GraduationCap className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{edu.qualification}</p>
              <p className="text-white/50 text-xs">{edu.institution} · {edu.year}</p>
              {edu.field && <p className="text-white/40 text-xs mt-0.5">{edu.field}</p>}
            </div>
          </div>
        ))}
        <button className="flex items-center gap-2 text-brand-400 text-sm mt-3 hover:text-brand-300 transition-colors">
          <Plus className="w-4 h-4" /> Add qualification
        </button>
      </div>

      {/* Experience */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-brand-400" />
          <h2 className="text-white font-semibold">Experience</h2>
        </div>
        {user.experience.map((exp, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Briefcase className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">{exp.title}</p>
              <p className="text-white/50 text-xs">{exp.company} · {exp.duration}</p>
              <p className="text-white/40 text-xs mt-1 line-clamp-2">{exp.description}</p>
            </div>
          </div>
        ))}
        <button className="flex items-center gap-2 text-brand-400 text-sm mt-3 hover:text-brand-300 transition-colors">
          <Plus className="w-4 h-4" /> Add experience
        </button>
      </div>

      {/* Interests */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-brand-400" />
          <h2 className="text-white font-semibold">Interests</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => {
            const active = user.interests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active
                    ? "bg-brand-500/30 text-brand-300 border border-brand-500/50"
                    : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                }`}
              >
                {active && <Check className="w-3 h-3" />}
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      {/* Certifications */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-yellow-400" />
          <h2 className="text-white font-semibold">Certifications</h2>
        </div>
        {user.certifications.map((cert, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-white/80 text-sm">{cert}</p>
          </div>
        ))}
        <button className="flex items-center gap-2 text-brand-400 text-sm mt-3 hover:text-brand-300 transition-colors">
          <Plus className="w-4 h-4" /> Add certification
        </button>
      </div>

      {/* Save */}
      <button
        onClick={save}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {saving ? (
          <>Saving... <span className="animate-spin">⟳</span></>
        ) : (
          <>Save profile <Check className="w-4 h-4" /></>
        )}
      </button>

      {/* What can I become */}
      <div className="glass-card p-5 bg-gradient-to-br from-purple-900/40 to-brand-900/30 border-purple-700/30">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">🔮</span>
          <div>
            <h2 className="text-white font-semibold">What can I become?</h2>
            <p className="text-white/60 text-sm mt-1">
              Based on your interests in <span className="text-brand-300">Technology</span>,{" "}
              <span className="text-brand-300">Creativity</span>, and{" "}
              <span className="text-brand-300">Problem Solving</span>:
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { path: user.careerGoal || "Your chosen career", icon: "🎯", desc: "Explore matching opportunities", color: "text-green-400", tab: "discover" },
            { path: "Build your transferable skills", icon: "🧭", desc: "Find learning resources", color: "text-yellow-400", tab: "upskill" },
            { path: "Prepare for interviews", icon: "🎤", desc: "Practise your next conversation", color: "text-blue-400", tab: "interview" },
            { path: "Strengthen your CV", icon: "📄", desc: "Tailor it to your chosen field", color: "text-purple-400", tab: "cv" },
          ].map(({ path, icon, desc, color, tab }) => (
            <button
              key={path}
              onClick={() => setActiveTab(tab)}
              className="w-full flex items-center gap-3 text-left hover:bg-white/5 rounded-xl p-2 transition-all"
            >
              <span className="text-xl">{icon}</span>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{path}</p>
                <p className={`text-xs ${color}`}>{desc}</p>
              </div>
              <Zap className="w-4 h-4 text-white/20" />
            </button>
          ))}
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
