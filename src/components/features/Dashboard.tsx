"use client";

import { useApp } from "@/lib/context";
import {
  TrendingUp,
  Target,
  BookOpen,
  Briefcase,
  Mic,
  ChevronRight,
  Star,
  Zap,
  MapPin,
} from "lucide-react";

export default function Dashboard() {
  const { user, opportunities, savedOpportunities, setActiveTab, setSelectedOpportunity } = useApp();

  const topMatches = [...opportunities]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  const stats = [
    { label: "Profile", value: `${user.profileComplete}%`, icon: Star, color: "from-brand-600 to-brand-400" },
    { label: "Skills", value: user.skills.length.toString(), icon: Zap, color: "from-purple-600 to-pink-500" },
    { label: "Courses", value: user.coursesCompleted.toString(), icon: BookOpen, color: "from-emerald-600 to-teal-500" },
    { label: "Applications", value: user.applicationsCount.toString(), icon: Briefcase, color: "from-orange-600 to-amber-500" },
  ];

  const nextActions = [
    {
      title: `Build skills for ${user.careerGoal || "your career goal"}`,
      desc: "Explore learning resources matched to your direction",
      icon: "📚",
      tab: "upskill",
      cta: "Start learning",
    },
    {
      title: "Practice your interview",
      desc: `Interview readiness: ${user.interviewReadiness}%`,
      icon: "🎤",
      tab: "interview",
      cta: "Practice now",
    },
    {
      title: "Explore nearby opportunities",
      desc: "12 opportunities within 15km",
      icon: "📍",
      tab: "map",
      cta: "View map",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <div className="glass-card p-6 bg-gradient-to-br from-brand-900/60 to-purple-900/40 border-brand-700/30">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/50 text-sm mb-1">Good morning 👋</p>
            <h1 className="text-2xl font-bold text-white">{user.name.split(" ")[0]}</h1>
            <p className="text-white/60 text-sm mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {user.location.city}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs mb-1">Goal</p>
            <p className="text-brand-300 font-semibold text-sm">{user.careerGoal}</p>
          </div>
        </div>

        {/* Career readiness */}
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-white/70">Career Readiness</span>
          <span className="text-brand-300 font-semibold">{user.interviewReadiness}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${user.interviewReadiness}%` }} />
        </div>
        <p className="text-white/40 text-xs mt-2">Complete 2 more steps to reach 80%</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-3 text-center">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-white font-bold text-lg leading-none">{value}</p>
            <p className="text-white/50 text-[11px] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* What should I do next */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-brand-400" />
          <h2 className="text-white font-semibold">Your next steps</h2>
        </div>
        <div className="space-y-3">
          {nextActions.map((action, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(action.tab)}
              className="glass-card-hover w-full p-4 flex items-center gap-4 text-left"
            >
              <span className="text-2xl">{action.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{action.title}</p>
                <p className="text-white/50 text-xs mt-0.5">{action.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-brand-400 text-xs font-medium shrink-0">
                <span>{action.cta}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Top matches */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-400" />
            <h2 className="text-white font-semibold">Top matches for you</h2>
          </div>
          <button
            onClick={() => setActiveTab("discover")}
            className="text-brand-400 text-xs font-medium flex items-center gap-1"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-3">
          {topMatches.map((op) => (
            <button
              key={op.id}
              onClick={() => { setSelectedOpportunity(op); setActiveTab("discover"); }}
              className="glass-card-hover w-full p-4 flex items-center gap-4 text-left"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${op.color} flex items-center justify-center text-2xl shrink-0`}>
                {op.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{op.title}</p>
                <p className="text-white/50 text-xs mt-0.5">{op.company}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    op.matchStatus === "ready"
                      ? "bg-green-500/20 text-green-400"
                      : op.matchStatus === "close"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {op.matchScore}% match
                  </span>
                  <span className="text-white/40 text-xs flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" /> {op.distanceKm} km
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Saved */}
      {savedOpportunities.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-brand-400" />
            <h2 className="text-white font-semibold">Saved opportunities</h2>
            <span className="text-xs bg-brand-500/30 text-brand-300 px-2 py-0.5 rounded-full">
              {savedOpportunities.length}
            </span>
          </div>
          <div className="space-y-2">
            {savedOpportunities.map((op) => (
              <button
                key={op.id}
                onClick={() => { setSelectedOpportunity(op); setActiveTab("discover"); }}
                className="glass-card-hover w-full p-3 flex items-center gap-3 text-left"
              >
                <span className="text-xl">{op.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{op.title}</p>
                  <p className="text-white/50 text-xs">{op.company}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  op.matchStatus === "ready"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {op.matchScore}%
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}
