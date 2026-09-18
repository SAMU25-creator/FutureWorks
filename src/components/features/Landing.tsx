"use client";

import { useApp } from "@/lib/context";
import { Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import WhatsAppPreview from "./WhatsAppPreview";

const features = [
  { icon: "🔎", title: "Discover", desc: "Swipe through personalised opportunities matched to your profile" },
  { icon: "🧩", title: "Skill Gap Analysis", desc: "See exactly what's missing and how to close the gap" },
  { icon: "📚", title: "Upskill", desc: "Follow guided learning paths to become qualified" },
  { icon: "🎤", title: "Interview Coach", desc: "Practise with AI and get feedback on every answer" },
  { icon: "📄", title: "CV Coach", desc: "Optimise your CV for any opportunity in seconds" },
  { icon: "📍", title: "Nearby", desc: "Find opportunities and learning resources around you" },
];

const journey = [
  { step: "01", title: "Build your profile", desc: "Education, skills, interests, career goals" },
  { step: "02", title: "Discover opportunities", desc: "Personalised to you — swipe to explore" },
  { step: "03", title: "See your match", desc: "Understand why you qualify and what you need" },
  { step: "04", title: "Close the gap", desc: "Follow your learning path" },
  { step: "05", title: "Prepare", desc: "Practice interviews. Optimise your CV." },
  { step: "06", title: "Apply", desc: "Go for it with confidence" },
];

export default function Landing() {
  const { setActiveTab, setProfileSetupDone } = useApp();

  const start = () => {
    setActiveTab("onboarding");
    setProfileSetupDone(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-6 pt-24 pb-16 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-pink-600/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Career Navigation
          </div>

          <h1 className="text-5xl font-black text-white leading-none mb-4">
            Future
            <span className="gradient-text">Works</span>
          </h1>

          <p className="text-xl font-semibold text-white/80 mb-3">
            Don't just find an opportunity.
            <br />
            <span className="gradient-text">Find your pathway to it.</span>
          </p>

          <p className="text-white/50 text-base leading-relaxed mb-8">
            Discover opportunities near you, understand your skill gaps, follow a personalised learning path, prepare for interviews, and apply with confidence.
          </p>

          <button
            onClick={start}
            className="btn-primary text-lg px-8 py-4 w-full flex items-center justify-center gap-3 mb-4"
          >
            Start your journey <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-white/40 text-xs">Create a profile to unlock your personalised career workspace.</p>
        </div>
      </section>

      {/* Tagline */}
      <section className="px-6 py-4">
        <div className="glass-card p-4 text-center border-brand-700/30 bg-brand-900/20">
          <p className="text-white/70 text-sm font-medium">
            <span className="gradient-text font-bold">Find it.</span>{" "}
            <span className="gradient-text font-bold">Learn it.</span>{" "}
            <span className="gradient-text font-bold">Prepare for it.</span>{" "}
            <span className="gradient-text font-bold">Go for it.</span>
          </p>
        </div>
      </section>

      {/* Example journey */}
      <section className="px-6 py-6">
        <h2 className="text-white font-bold text-xl mb-1">Your pathway starts here.</h2>
        <p className="text-white/50 text-sm mb-5">Build a profile, then turn your experience into a clear next step.</p>

        <div className="space-y-3">
          <div className="glass-card p-4 bg-white/3">
            <p className="text-white/70 text-sm">Tell us what you have learned, what you can do, and where you want to go. FutureWorks connects the dots.</p>
          </div>

          <div className="flex items-center gap-2 text-white/30 px-2">
            <div className="flex-1 h-px bg-white/10" />
            <ArrowRight className="w-4 h-4" />
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {[
            { emoji: "👤", text: "He creates his FutureWorks profile in 3 minutes" },
            { emoji: "🔎", text: "FutureWorks finds 17 opportunities matched to him" },
            { emoji: "🧩", text: "For his top match (78%), he's missing only one skill: Java" },
            { emoji: "📚", text: "FutureWorks shows him a Java course 3 km away" },
            { emoji: "🎤", text: "He practises his interview with the AI coach and gets real feedback" },
            { emoji: "📄", text: "His CV is tailored for the opportunity in seconds" },
            { emoji: "🚀", text: "He applies — ready, prepared, and confident" },
          ].map(({ emoji, text }, i) => (
            <div key={i} className="flex items-center gap-3 glass-card p-3">
              <span className="text-xl">{emoji}</span>
              <p className="text-white/80 text-sm">{text}</p>
              {i === 6 && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 ml-auto" />}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-6">
        <h2 className="text-white font-bold text-xl mb-5">Everything you need</h2>
        <div className="grid grid-cols-2 gap-3">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="glass-card p-4">
              <span className="text-2xl">{icon}</span>
              <p className="text-white font-semibold text-sm mt-2">{title}</p>
              <p className="text-white/50 text-xs mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <WhatsAppPreview />

      {/* Journey */}
      <section className="px-6 py-6">
        <h2 className="text-white font-bold text-xl mb-5">Your journey</h2>
        <div className="space-y-3">
          {journey.map(({ step, title, desc }, i) => (
            <div key={step} className="flex gap-4 items-start">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-sm">
                  {step}
                </div>
                {i < journey.length - 1 && <div className="w-0.5 h-4 bg-brand-700/50 mt-1" />}
              </div>
              <div className="pt-1.5">
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-white/50 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-8">
        <div className="glass-card p-6 text-center bg-gradient-to-br from-brand-900/60 to-purple-900/40 border-brand-700/30">
          <h2 className="text-white font-bold text-2xl mb-2">Ready to find your pathway?</h2>
          <p className="text-white/60 text-sm mb-6">
            Join thousands of people discovering what they can become.
          </p>
          <button
            onClick={start}
            className="btn-primary text-lg px-8 py-4 w-full flex items-center justify-center gap-3"
          >
            Get started — it's free <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <div className="h-24" />
    </div>
  );
}
