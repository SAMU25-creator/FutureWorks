"use client";

import { useState, useRef } from "react";
import { useApp } from "@/lib/context";
import { Opportunity } from "@/types";
import {
  X,
  Heart,
  Star,
  MapPin,
  Clock,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function Discover() {
  const { opportunities, addSwipe, swipedCards, setSelectedOpportunity, selectedOpportunity, setActiveTab } = useApp();

  const swipedIds = new Set(swipedCards.map((c) => c.opportunity.id));
  const remaining = opportunities.filter((op) => !swipedIds.has(op.id));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastSwipe, setLastSwipe] = useState<"left" | "right" | "super" | null>(null);
  const dragStartX = useRef(0);

  const current = remaining[currentIndex];

  const doSwipe = (dir: "left" | "right" | "super") => {
    if (!current) return;
    addSwipe({ opportunity: current, decision: dir });
    setLastSwipe(dir);
    setDragX(0);
    setTimeout(() => {
      setCurrentIndex((i) => i);
      setLastSwipe(null);
    }, 500);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragX(x - dragStartX.current);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (dragX > 80) doSwipe("right");
    else if (dragX < -80) doSwipe("left");
    else setDragX(0);
  };

  if (selectedOpportunity) {
    return <OpportunityDetail op={selectedOpportunity} onBack={() => setSelectedOpportunity(null)} onPathway={() => { setActiveTab("upskill"); setSelectedOpportunity(null); }} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-heading">Discover</h1>
        <p className="section-sub">Opportunities matched to your profile</p>
      </div>

      {remaining.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-white font-bold text-xl mb-2">You've seen them all!</h2>
          <p className="text-white/50 text-sm mb-4">
            You've gone through all {opportunities.length} opportunities.
          </p>
          <button
            onClick={() => setActiveTab("dashboard")}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* Card stack */}
          <div className="relative h-[420px] flex items-center justify-center">
            {/* Background card (next) */}
            {remaining[currentIndex + 1] && (
              <div className="absolute inset-0 scale-95 opacity-50">
                <SwipeCard op={remaining[currentIndex + 1]} offset={0} />
              </div>
            )}

            {/* Current card */}
            {current && (
              <div
                className="absolute inset-0 swipe-card"
                style={{
                  transform: `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`,
                  transition: isDragging ? "none" : "transform 0.3s ease",
                  opacity: lastSwipe ? 0 : 1,
                }}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                <SwipeCard op={current} offset={dragX} />

                {/* Like/Nope overlay */}
                {dragX > 30 && (
                  <div className="absolute top-8 left-8 bg-green-500/80 text-white font-bold text-2xl px-4 py-2 rounded-xl rotate-[-20deg] border-4 border-green-400">
                    INTERESTED ✓
                  </div>
                )}
                {dragX < -30 && (
                  <div className="absolute top-8 right-8 bg-red-500/80 text-white font-bold text-2xl px-4 py-2 rounded-xl rotate-[20deg] border-4 border-red-400">
                    SKIP ✗
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Counter */}
          <div className="text-center text-white/40 text-sm">
            {remaining.length} opportunities remaining
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => doSwipe("left")}
              className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <X className="w-6 h-6 text-red-400" />
            </button>
            <button
              onClick={() => doSwipe("super")}
              className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-500/40 hover:bg-brand-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <Star className="w-5 h-5 text-brand-400" />
            </button>
            <button
              onClick={() => doSwipe("right")}
              className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/40 hover:bg-green-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <Heart className="w-6 h-6 text-green-400" />
            </button>
          </div>

          {/* Tap to see details */}
          <div className="text-center">
            <button
              onClick={() => setSelectedOpportunity(current)}
              className="text-brand-400 text-sm font-medium hover:text-brand-300 transition-colors"
            >
              Tap to see match details →
            </button>
          </div>
        </>
      )}

      {/* Swiped summary */}
      {swipedCards.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-white/70 text-sm font-medium mb-3">Recent decisions</h3>
          <div className="space-y-2">
            {swipedCards.slice(-3).reverse().map(({ opportunity, decision }) => (
              <div key={opportunity.id} className="flex items-center gap-3">
                <span className="text-lg">{opportunity.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{opportunity.title}</p>
                  <p className="text-white/40 text-xs">{opportunity.company}</p>
                </div>
                {decision === "right" || decision === "super" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SwipeCard({ op }: { op: Opportunity; offset?: number }) {
  return (
    <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${op.color} p-1 shadow-2xl`}>
      <div className="w-full h-full rounded-[22px] bg-black/60 backdrop-blur-sm p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{op.logo}</div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-xl leading-tight">{op.title}</h2>
            <p className="text-white/70 text-sm">{op.company}</p>
            <div className="flex items-center gap-1 mt-1 text-white/50 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              {op.location} · {op.distanceKm} km
            </div>
          </div>
        </div>

        {/* Match score */}
        <div className="glass-card p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">Your match</span>
            <span className={`font-bold text-2xl ${
              op.matchStatus === "ready" ? "text-green-400" :
              op.matchStatus === "close" ? "text-yellow-400" : "text-blue-400"
            }`}>{op.matchScore}%</span>
          </div>
          <div className="progress-bar">
            <div className={`h-full rounded-full transition-all duration-700 ${
              op.matchStatus === "ready" ? "bg-gradient-to-r from-green-600 to-emerald-400" :
              op.matchStatus === "close" ? "bg-gradient-to-r from-yellow-600 to-amber-400" :
              "bg-gradient-to-r from-blue-600 to-cyan-400"
            }`} style={{ width: `${op.matchScore}%` }} />
          </div>
          <p className={`text-xs mt-2 font-medium ${
            op.matchStatus === "ready" ? "text-green-400" :
            op.matchStatus === "close" ? "text-yellow-400" : "text-blue-400"
          }`}>
            {op.matchStatus === "ready" ? "🟢 Ready to apply" :
             op.matchStatus === "close" ? "🟡 You're close" : "🔵 Build towards this"}
          </p>
        </div>

        {/* Skills */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-white/50 text-xs mb-2">You have</p>
            <div className="space-y-1">
              {op.skillsYouHave.slice(0, 3).map((s) => (
                <div key={s} className="flex items-center gap-1.5 text-xs text-green-300">
                  <span className="text-green-400">✓</span> {s}
                </div>
              ))}
            </div>
          </div>
          {op.skillsYouNeed.length > 0 && (
            <div>
              <p className="text-white/50 text-xs mb-2">Missing</p>
              <div className="space-y-1">
                {op.skillsYouNeed.slice(0, 3).map((s) => (
                  <div key={s} className="flex items-center gap-1.5 text-xs text-red-300">
                    <span className="text-red-400">✗</span> {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stipend + Deadline */}
        <div className="flex items-center gap-4 mt-auto">
          {op.stipend && (
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              {op.stipend}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-white/60">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            Deadline: {new Date(op.deadline).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
          </div>
        </div>
      </div>
    </div>
  );
}

function OpportunityDetail({
  op,
  onBack,
  onPathway,
}: {
  op: Opportunity;
  onBack: () => void;
  onPathway: () => void;
}) {
  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Discover
      </button>

      {/* Header */}
      <div className={`glass-card p-6 bg-gradient-to-br ${op.color} bg-opacity-20`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">{op.logo}</div>
          <div>
            <h1 className="text-white font-bold text-2xl">{op.title}</h1>
            <p className="text-white/70">{op.company}</p>
            <p className="text-white/50 text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" /> {op.location} · {op.distanceKm} km away
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${
            op.matchStatus === "ready" ? "bg-green-500/30 text-green-300 border border-green-500/40" :
            op.matchStatus === "close" ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/40" :
            "bg-blue-500/30 text-blue-300 border border-blue-500/40"
          }`}>
            {op.matchScore}% match
          </span>
          <span className="tag-blue capitalize">{op.type}</span>
          {op.stipend && <span className="tag-green">{op.stipend}</span>}
        </div>
      </div>

      {/* Match breakdown */}
      <div className="glass-card p-5">
        <h2 className="text-white font-semibold mb-4">
          {op.matchStatus === "ready" ? "🟢 You're ready to apply!" :
           op.matchStatus === "close" ? "🟡 You're close." :
           "🔵 You can build towards this."}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-white/50 text-sm mb-3">Skills you have</p>
            <div className="space-y-2">
              {op.skillsYouHave.map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm text-green-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> {s}
                </div>
              ))}
            </div>
          </div>
          {op.skillsYouNeed.length > 0 && (
            <div>
              <p className="text-white/50 text-sm mb-3">Skills to develop</p>
              <div className="space-y-2">
                {op.skillsYouNeed.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-red-300">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" /> {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-5">
        <h2 className="text-white font-semibold mb-3">About this opportunity</h2>
        <p className="text-white/70 text-sm leading-relaxed">{op.description}</p>
      </div>

      {/* Pathway preview */}
      <div className="glass-card p-5">
        <h2 className="text-white font-semibold mb-4">Your pathway</h2>
        <div className="space-y-3">
          {op.pathway.map((step, i) => (
            <div key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step.type === "learn" ? "bg-brand-500/30 text-brand-300 border border-brand-500/40" :
                  step.type === "build" ? "bg-purple-500/30 text-purple-300 border border-purple-500/40" :
                  step.type === "practice" ? "bg-orange-500/30 text-orange-300 border border-orange-500/40" :
                  "bg-green-500/30 text-green-300 border border-green-500/40"
                }`}>
                  {i + 1}
                </div>
                {i < op.pathway.length - 1 && <div className="w-0.5 h-4 bg-white/10 mt-1" />}
              </div>
              <div className="pb-2 min-w-0">
                <p className="text-white text-sm font-medium">{step.title}</p>
                <p className="text-white/50 text-xs mt-0.5">{step.description}</p>
                {step.location && (
                  <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {step.location}
                    {step.distanceKm && ` · ${step.distanceKm} km`}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onPathway} className="btn-primary w-full flex items-center justify-center gap-2">
        Start my pathway <ArrowRight className="w-4 h-4" />
      </button>

      <div className="h-4" />
    </div>
  );
}
