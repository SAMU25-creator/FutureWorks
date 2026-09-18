"use client";

import { MessageCircle, Check, CheckCheck } from "lucide-react";

const messages = [
  {
    from: "bot",
    text: "Hi 👋 Welcome to FutureWorks. What would you like help with today?",
  },
  {
    from: "bot",
    options: [
      "🔎 Check opportunities I qualify for",
      "📄 Update my CV",
      "🎤 Practise for an interview",
    ],
  },
  { from: "user", text: "Check opportunities I qualify for" },
  {
    from: "bot",
    text: "You're a 78% match for a Junior Developer Internship at CapeTech. You're missing one skill: Java. Want a free course nearby?",
  },
  { from: "user", text: "Yes please" },
];

export default function WhatsAppPreview() {
  return (
    <section className="px-6 py-6">
      <div className="glass-card p-5 bg-gradient-to-br from-green-900/20 to-emerald-900/10 border-green-700/20">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-green-400" />
          </div>
          <h2 className="text-white font-bold text-lg">No app? No data? No problem.</h2>
        </div>
        <p className="text-white/50 text-sm mb-5">
          The same matching, upskilling and interview coaching — right inside WhatsApp, for anyone without a smartphone or a data bundle to spare.
        </p>

        {/* Phone-style chat mock */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0b141a] max-w-xs mx-auto shadow-xl">
          <div className="bg-[#202c33] px-4 py-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">
              FW
            </div>
            <div>
              <p className="text-white text-xs font-semibold leading-tight">FutureWorks</p>
              <p className="text-white/40 text-[10px] leading-tight">WhatsApp Business</p>
            </div>
          </div>

          <div className="p-3 space-y-2 bg-[#0b141a]">
            {messages.map((m, i) => {
              if (m.options) {
                return (
                  <div key={i} className="flex flex-col gap-1.5 items-start">
                    {m.options.map((o) => (
                      <div
                        key={o}
                        className="bg-[#005c4b]/40 border border-green-700/30 text-white/80 text-[11px] rounded-xl px-3 py-1.5"
                      >
                        {o}
                      </div>
                    ))}
                  </div>
                );
              }
              const isUser = m.from === "user";
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] text-[11px] leading-snug rounded-xl px-3 py-1.5 ${
                      isUser
                        ? "bg-[#005c4b] text-white rounded-br-sm"
                        : "bg-[#202c33] text-white/90 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                    {isUser && (
                      <CheckCheck className="w-3 h-3 text-sky-300 inline-block ml-1 -mb-0.5" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-white/30 text-[11px] text-center mt-4">
          Vision for post-hackathon build — same AI engine, delivered over WhatsApp
        </p>
      </div>
    </section>
  );
}
