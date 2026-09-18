"use client";

import { useApp } from "@/lib/context";
import {
  Home,
  Search,
  BookOpen,
  Mic,
  FileText,
  MapPin,
  User,
  Zap,
} from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "discover", label: "Discover", icon: Search },
  { id: "upskill", label: "Upskill", icon: BookOpen },
  { id: "interview", label: "Interview", icon: Mic },
  { id: "cv", label: "CV Coach", icon: FileText },
  { id: "map", label: "Nearby", icon: MapPin },
  { id: "profile", label: "Profile", icon: User },
];

export default function Navigation() {
  const { user, activeTab, setActiveTab } = useApp();
  const initials = user.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">FutureWorks</span>
        </div>
        <button
          onClick={() => setActiveTab("profile")}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-brand-900/50"
        >
          {initials}
        </button>
      </header>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-0 ${
                  active
                    ? "text-brand-400"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <div
                  className={`relative p-1.5 rounded-lg transition-all duration-200 ${
                    active ? "bg-brand-500/20" : ""
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {active && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-400" />
                  )}
                </div>
                <span className="text-[10px] font-medium truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
