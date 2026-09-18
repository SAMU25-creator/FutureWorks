"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { mockOpportunities } from "@/data/mockData";
import { Opportunity, OpportunityType, MatchStatus } from "@/types";
import { MapPin, Filter, X, ChevronRight, Navigation } from "lucide-react";

const TYPE_FILTERS: { value: OpportunityType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "job", label: "Jobs" },
  { value: "internship", label: "Internships" },
  { value: "learnership", label: "Learnerships" },
  { value: "apprenticeship", label: "Apprenticeships" },
  { value: "bursary", label: "Bursaries" },
  { value: "course", label: "Courses" },
  { value: "programme", label: "Programmes" },
];

const STATUS_FILTERS: { value: MatchStatus | "all"; label: string; color: string }[] = [
  { value: "all", label: "All", color: "text-white/60" },
  { value: "ready", label: "Ready", color: "text-green-400" },
  { value: "close", label: "Close", color: "text-yellow-400" },
  { value: "build-towards", label: "Build towards", color: "text-blue-400" },
];

const DISTANCE_FILTERS = [5, 10, 25, 50];

// SVG pseudo-map using positioned pins
const MAP_PINS: { id: string; x: number; y: number }[] = [
  { id: "op1", x: 68, y: 35 },
  { id: "op2", x: 72, y: 18 },
  { id: "op3", x: 45, y: 47 },
  { id: "op4", x: 61, y: 28 },
  { id: "op5", x: 55, y: 60 },
  { id: "op6", x: 38, y: 65 },
];

export default function OpportunitiesMap() {
  const { setSelectedOpportunity, setActiveTab } = useApp();
  const [typeFilter, setTypeFilter] = useState<OpportunityType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<MatchStatus | "all">("all");
  const [distanceFilter, setDistanceFilter] = useState<number>(25);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Opportunity | null>(null);

  const filtered = mockOpportunities.filter((op) => {
    if (typeFilter !== "all" && op.type !== typeFilter) return false;
    if (statusFilter !== "all" && op.matchStatus !== statusFilter) return false;
    if (op.distanceKm > distanceFilter) return false;
    return true;
  });

  const pinForOp = (id: string) => MAP_PINS.find((p) => p.id === id);

  const statusColor = (status: MatchStatus) =>
    status === "ready" ? "#4ade80" : status === "close" ? "#facc15" : "#60a5fa";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-heading">Nearby</h1>
          <p className="section-sub">Opportunities around you</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            showFilters ? "bg-brand-500/30 text-brand-300 border border-brand-500/40" : "btn-secondary py-2 px-3"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="glass-card p-4 space-y-4">
          <div>
            <p className="text-white/50 text-xs font-medium mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {TYPE_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTypeFilter(value as OpportunityType | "all")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    typeFilter === value
                      ? "bg-brand-500/40 text-brand-300 border border-brand-500/50"
                      : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white/50 text-xs font-medium mb-2">Eligibility</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value as MatchStatus | "all")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === value
                      ? "bg-white/20 text-white border border-white/30"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  } ${color}`}
                >
                  {value !== "all" && (
                    <span className="mr-1">
                      {value === "ready" ? "🟢" : value === "close" ? "🟡" : "🔵"}
                    </span>
                  )}
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white/50 text-xs font-medium mb-2">Distance: within {distanceFilter} km</p>
            <div className="flex gap-2">
              {DISTANCE_FILTERS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDistanceFilter(d)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    distanceFilter === d
                      ? "bg-brand-500/40 text-brand-300 border border-brand-500/50"
                      : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {d} km
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map area */}
      <div className="glass-card overflow-hidden" style={{ height: "280px" }}>
        <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-indigo-950">
          {/* Grid lines (fake map) */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            {/* Roads */}
            <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#6366f1" strokeWidth="1.5" />
            <line x1="0" y1="65%" x2="100%" y2="65%" stroke="#6366f1" strokeWidth="1" />
            <line x1="40%" y1="0" x2="40%" y2="100%" stroke="#6366f1" strokeWidth="1" />
            <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#6366f1" strokeWidth="1.5" />
            <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#6366f1" strokeWidth="0.5" />
            {/* Streets */}
            <line x1="0" y1="55%" x2="100%" y2="55%" stroke="#4f46e5" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#4f46e5" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#4f46e5" strokeWidth="0.5" strokeDasharray="4 4" />
            {/* Blocks */}
            <rect x="21%" y="41%" width="18%" height="13%" fill="#ffffff" fillOpacity="0.02" rx="2" />
            <rect x="41%" y="41%" width="28%" height="13%" fill="#ffffff" fillOpacity="0.02" rx="2" />
            <rect x="21%" y="26%" width="18%" height="13%" fill="#ffffff" fillOpacity="0.02" rx="2" />
            <rect x="41%" y="26%" width="28%" height="13%" fill="#ffffff" fillOpacity="0.02" rx="2" />
            <rect x="71%" y="41%" width="18%" height="13%" fill="#ffffff" fillOpacity="0.02" rx="2" />
            <rect x="71%" y="26%" width="18%" height="13%" fill="#ffffff" fillOpacity="0.02" rx="2" />
          </svg>

          {/* Area labels */}
          <div className="absolute top-[15%] left-[43%] text-white/20 text-[9px] font-medium">MIDRAND</div>
          <div className="absolute top-[38%] left-[23%] text-white/20 text-[9px] font-medium">SOWETO</div>
          <div className="absolute top-[38%] left-[60%] text-white/20 text-[9px] font-medium">SANDTON</div>
          <div className="absolute top-[61%] left-[43%] text-white/20 text-[9px] font-medium">JOHANNESBURG CBD</div>

          {/* Opportunity pins */}
          {filtered.map((op) => {
            const pin = pinForOp(op.id);
            if (!pin) return null;
            const color = statusColor(op.matchStatus);
            const isSelected = selectedPin?.id === op.id;

            return (
              <button
                key={op.id}
                onClick={() => setSelectedPin(isSelected ? null : op)}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-full group"
              >
                <div
                  className={`flex flex-col items-center transition-all ${isSelected ? "scale-125" : "hover:scale-110"}`}
                >
                  <div
                    className="px-2 py-1 rounded-lg text-[9px] font-bold text-black mb-0.5 shadow-lg whitespace-nowrap max-w-[80px] truncate"
                    style={{ backgroundColor: color }}
                  >
                    {op.matchScore}%
                  </div>
                  <div className="text-base drop-shadow-lg">{op.logo}</div>
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-0.5"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </button>
            );
          })}

          {/* User location */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: "35%", top: "52%" }}
          >
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-brand-500 shadow-lg shadow-brand-500/50" />
              <div className="absolute inset-0 w-4 h-4 rounded-full bg-brand-400 opacity-40 animate-ping" />
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[9px]">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />Ready</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />Close</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />Build</div>
          </div>

          {/* Selected pin popup */}
          {selectedPin && (
            <div
              className="absolute bottom-3 right-3 left-16 glass-card p-3 text-left z-10 border-brand-500/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedPin.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-xs truncate">{selectedPin.title}</p>
                  <p className="text-white/50 text-[10px]">{selectedPin.distanceKm} km away</p>
                </div>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  selectedPin.matchStatus === "ready" ? "bg-green-500/20 text-green-400" :
                  selectedPin.matchStatus === "close" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-blue-500/20 text-blue-400"
                }`}>{selectedPin.matchScore}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-white/60">
          Showing <span className="text-white font-medium">{filtered.length}</span> of {mockOpportunities.length} opportunities
        </p>
        <div className="flex items-center gap-1 text-white/40 text-xs">
          <Navigation className="w-3.5 h-3.5" />
          Within {distanceFilter} km
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((op) => (
          <button
            key={op.id}
            onClick={() => { setSelectedOpportunity(op); setActiveTab("discover"); }}
            className={`glass-card-hover w-full p-4 flex items-center gap-4 text-left ${
              selectedPin?.id === op.id ? "border-brand-500/60 bg-brand-900/30" : ""
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${op.color} flex items-center justify-center text-2xl shrink-0`}>
              {op.logo}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{op.title}</p>
              <p className="text-white/50 text-xs">{op.company}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  op.matchStatus === "ready" ? "bg-green-500/20 text-green-400" :
                  op.matchStatus === "close" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-blue-500/20 text-blue-400"
                }`}>
                  {op.matchStatus === "ready" ? "🟢 Ready" : op.matchStatus === "close" ? "🟡 Close" : "🔵 Build"}
                  {" · "}{op.matchScore}%
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

      {filtered.length === 0 && (
        <div className="glass-card p-8 text-center">
          <div className="text-4xl mb-3">📍</div>
          <p className="text-white font-medium">No opportunities found</p>
          <p className="text-white/50 text-sm mt-1">Try adjusting your filters or increasing the distance.</p>
          <button
            onClick={() => { setTypeFilter("all"); setStatusFilter("all"); setDistanceFilter(50); }}
            className="btn-secondary mt-4 text-sm py-2"
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}
