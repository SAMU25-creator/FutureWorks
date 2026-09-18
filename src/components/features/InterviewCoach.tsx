"use client";

import { useState } from "react";
import { interviewQuestions } from "@/data/mockData";
import { mockOpportunities } from "@/data/mockData";
import { InterviewFeedback } from "@/types";
import { Mic, Send, RotateCcw, ChevronRight, CheckCircle2, Star, Volume2 } from "lucide-react";

const STAR_TIPS = [
  { label: "S — Situation", desc: "Set the scene. What was happening?", color: "text-blue-400" },
  { label: "T — Task", desc: "What was your responsibility?", color: "text-purple-400" },
  { label: "A — Action", desc: "What did you do specifically?", color: "text-yellow-400" },
  { label: "R — Result", desc: "What was the outcome?", color: "text-green-400" },
];

function generateFeedback(answer: string, modelAnswer: string): InterviewFeedback {
  const len = answer.trim().split(" ").length;
  const structure = Math.min(100, 40 + (len > 30 ? 30 : len) + Math.floor(Math.random() * 20));
  const relevance = Math.min(100, 50 + Math.floor(Math.random() * 40));
  const clarity = Math.min(100, 45 + Math.floor(Math.random() * 40));
  const confidence = Math.min(100, 50 + Math.floor(Math.random() * 35));
  const overall = Math.round((structure + relevance + clarity + confidence) / 4);

  const strengths = [];
  const improvements = [];

  if (len > 50) strengths.push("Good length — you provided enough detail");
  else improvements.push("Try to give a more detailed answer with a specific example");

  if (answer.toLowerCase().includes("i") && answer.toLowerCase().includes("result"))
    strengths.push("You referred to results — that's a strong habit");
  else improvements.push("Include the outcome or result of your action (STAR: R)");

  if (answer.toLowerCase().includes("team") || answer.toLowerCase().includes("we"))
    strengths.push("You mentioned teamwork — relevant for most roles");
  else improvements.push("If relevant, mention how you worked with others");

  if (strengths.length === 0) strengths.push("You attempted the question — good start");

  return {
    structure,
    relevance,
    clarity,
    confidence,
    overall,
    strengths,
    improvements,
    tip: overall >= 75
      ? "Strong response. Keep practising to build consistency."
      : overall >= 55
      ? "Decent start. Focus on structuring with the STAR method."
      : "Keep practising. Try using the model answer as a guide.",
  };
}

type Stage = "select" | "question" | "feedback" | "model";

export default function InterviewCoach() {
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [stage, setStage] = useState<Stage>("select");
  const [sessionScores, setSessionScores] = useState<number[]>([]);

  const op = mockOpportunities.find((o) => o.id === selectedOp);
  const q = interviewQuestions[qIndex];

  const submit = () => {
    if (answer.trim().length < 10) return;
    const fb = generateFeedback(answer, q.model_answer);
    setFeedback(fb);
    setSessionScores((s) => [...s, fb.overall]);
    setStage("feedback");
  };

  const next = () => {
    setAnswer("");
    setFeedback(null);
    if (qIndex < interviewQuestions.length - 1) {
      setQIndex((i) => i + 1);
      setStage("question");
    } else {
      setQIndex(0);
      setStage("select");
    }
  };

  const restart = () => {
    setAnswer("");
    setFeedback(null);
    setStage("question");
  };

  const avgScore =
    sessionScores.length > 0
      ? Math.round(sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length)
      : 0;

  if (stage === "select") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="section-heading">Interview Coach</h1>
          <p className="section-sub">Practice with AI feedback. Get better every session.</p>
        </div>

        {sessionScores.length > 0 && (
          <div className="glass-card p-4 bg-brand-900/30 border-brand-700/30">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-white font-semibold">Session score: {avgScore}%</p>
                <p className="text-white/50 text-xs">{sessionScores.length} question(s) practised</p>
              </div>
            </div>
          </div>
        )}

        {/* Choose opportunity */}
        <div>
          <h2 className="text-white/70 text-sm font-medium mb-3">Practice interview for</h2>
          <div className="space-y-3">
            {mockOpportunities.slice(0, 4).map((o) => (
              <button
                key={o.id}
                onClick={() => { setSelectedOp(o.id); setQIndex(0); setStage("question"); }}
                className="glass-card-hover w-full p-4 flex items-center gap-4 text-left"
              >
                <span className="text-2xl">{o.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{o.title}</p>
                  <p className="text-white/50 text-xs">{o.company}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
              </button>
            ))}
            <button
              onClick={() => { setSelectedOp(null); setQIndex(0); setStage("question"); }}
              className="glass-card-hover w-full p-4 flex items-center gap-4 text-left"
            >
              <span className="text-2xl">🎯</span>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">General practice</p>
                <p className="text-white/50 text-xs">Common interview questions for any role</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
            </button>
          </div>
        </div>

        {/* STAR method */}
        <div className="glass-card p-5">
          <h2 className="text-white font-semibold mb-4">The STAR Method</h2>
          <p className="text-white/60 text-sm mb-4">Structure your answers using STAR to make them clear and compelling.</p>
          <div className="space-y-3">
            {STAR_TIPS.map(({ label, desc, color }) => (
              <div key={label} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold ${color} shrink-0`}>
                  {label[0]}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${color}`}>{label}</p>
                  <p className="text-white/50 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stage === "question") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStage("select")}
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            ← Exit
          </button>
          <span className="text-white/40 text-sm">
            Question {qIndex + 1} of {interviewQuestions.length}
          </span>
        </div>

        {/* Question */}
        <div className="glass-card p-6 bg-brand-900/30 border-brand-700/30">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand-500/30 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <p className="text-white/50 text-xs mb-1">Interview question</p>
              <p className="text-white font-semibold text-lg leading-snug">{q.question}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`tag-blue capitalize text-xs`}>{q.category}</span>
            {op && <span className="tag-blue text-xs">{op.title}</span>}
          </div>

          <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white/50 text-xs font-medium mb-1">💡 Hint</p>
            <p className="text-white/70 text-sm">{q.hint}</p>
          </div>
        </div>

        {/* STAR mini-reference */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STAR_TIPS.map(({ label, color }) => (
            <div key={label} className={`shrink-0 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium ${color}`}>
              {label}
            </div>
          ))}
        </div>

        {/* Answer input */}
        <div className="glass-card p-4">
          <p className="text-white/50 text-xs mb-2">Your answer</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here... Use STAR: describe the Situation, your Task, the Actions you took, and the Result."
            rows={6}
            className="input-field resize-none text-sm"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-white/30 text-xs">{answer.trim().split(" ").filter(Boolean).length} words</span>
            <button
              onClick={submit}
              disabled={answer.trim().length < 10}
              className="btn-primary flex items-center gap-2 py-2 px-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Get feedback <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "feedback" && feedback) {
    const scoreColor = feedback.overall >= 75 ? "text-green-400" : feedback.overall >= 55 ? "text-yellow-400" : "text-red-400";
    const metrics = [
      { label: "Structure", value: feedback.structure },
      { label: "Relevance", value: feedback.relevance },
      { label: "Clarity", value: feedback.clarity },
      { label: "Confidence", value: feedback.confidence },
    ];

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-white/50 text-sm">Question {qIndex + 1} feedback</p>
          <button
            onClick={() => setStage("question")}
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            View question
          </button>
        </div>

        {/* Score */}
        <div className="glass-card p-6 text-center">
          <p className="text-white/50 text-sm mb-2">Overall score</p>
          <p className={`text-6xl font-bold ${scoreColor}`}>{feedback.overall}</p>
          <p className="text-white/40 text-sm mt-1">out of 100</p>
          <p className="text-white/70 text-sm mt-3">{feedback.tip}</p>
        </div>

        {/* Breakdown */}
        <div className="glass-card p-5">
          <h2 className="text-white font-semibold mb-4">Score breakdown</h2>
          <div className="space-y-3">
            {metrics.map(({ label, value }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/70 text-sm">{label}</span>
                  <span className="text-white font-medium text-sm">{value}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      value >= 75 ? "bg-gradient-to-r from-green-600 to-emerald-400" :
                      value >= 55 ? "bg-gradient-to-r from-yellow-600 to-amber-400" :
                      "bg-gradient-to-r from-red-600 to-rose-400"
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What you did well */}
        {feedback.strengths.length > 0 && (
          <div className="glass-card p-5">
            <h2 className="text-white font-semibold mb-3">What you did well</h2>
            <div className="space-y-2">
              {feedback.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-white/70 text-sm">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {feedback.improvements.length > 0 && (
          <div className="glass-card p-5">
            <h2 className="text-white font-semibold mb-3">Areas to improve</h2>
            <div className="space-y-2">
              {feedback.improvements.map((imp, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5 shrink-0">→</span>
                  <p className="text-white/70 text-sm">{imp}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={restart} className="btn-secondary flex-1 flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Try again
          </button>
          <button onClick={() => setStage("model")} className="btn-secondary flex-1 flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4" /> Model answer
          </button>
        </div>

        <button onClick={next} className="btn-primary w-full">
          {qIndex < interviewQuestions.length - 1 ? "Next question →" : "Finish session"}
        </button>

        <div className="h-4" />
      </div>
    );
  }

  if (stage === "model") {
    return (
      <div className="space-y-5">
        <button
          onClick={() => setStage("feedback")}
          className="text-white/50 hover:text-white text-sm transition-colors"
        >
          ← Back to feedback
        </button>

        <div className="glass-card p-5 bg-brand-900/20">
          <p className="text-white/50 text-xs mb-2">Question</p>
          <p className="text-white font-semibold">{q.question}</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-400" />
            <h2 className="text-white font-semibold">Model answer</h2>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">{q.model_answer}</p>
        </div>

        <div className="glass-card p-4">
          <p className="text-white/50 text-xs mb-2">Remember: STAR</p>
          <div className="grid grid-cols-2 gap-2">
            {STAR_TIPS.map(({ label, desc, color }) => (
              <div key={label} className="bg-white/5 rounded-lg p-2">
                <p className={`text-xs font-bold ${color}`}>{label}</p>
                <p className="text-white/40 text-xs mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={restart} className="btn-primary w-full flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> Practice this question again
        </button>

        <div className="h-4" />
      </div>
    );
  }

  return null;
}
