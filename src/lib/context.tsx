"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserProfile, Opportunity, SwipedCard } from "@/types";
import { mockOpportunities } from "@/data/mockData";

const emptyUser: UserProfile = {
  id: "",
  name: "",
  email: "",
  location: { city: "", lat: -26.2041, lng: 28.0473 },
  education: [],
  skills: [],
  certifications: [],
  experience: [],
  interests: [],
  careerGoal: "",
  profileComplete: 0,
  coursesCompleted: 0,
  applicationsCount: 0,
  interviewReadiness: 0,
};

function safeUserProfile(profile: UserProfile): UserProfile {
  const hasReadableName = /^[A-Za-z][A-Za-z.' -]{1,59}$/.test(profile.name.trim()) && !/[\uFFFD]/.test(profile.name);
  return hasReadableName
    ? profile
    : { ...profile, name: profile.email.split("@")[0] || "FutureWorks user" };
}

interface AppContextType {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  opportunities: Opportunity[];
  swipedCards: SwipedCard[];
  addSwipe: (card: SwipedCard) => void;
  savedOpportunities: Opportunity[];
  selectedOpportunity: Opportunity | null;
  setSelectedOpportunity: (op: Opportunity | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profileSetupDone: boolean;
  setProfileSetupDone: (v: boolean) => void;
  cvChoice: "existing" | "generated" | null;
  setCvChoice: (choice: "existing" | "generated" | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(emptyUser);
  const updateUser = (profile: UserProfile) => setUser(safeUserProfile(profile));
  const [swipedCards, setSwipedCards] = useState<SwipedCard[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [activeTab, setActiveTab] = useState("landing");
  const [profileSetupDone, setProfileSetupDone] = useState(false);
  const [cvChoice, setCvChoice] = useState<"existing" | "generated" | null>(null);

  const addSwipe = (card: SwipedCard) => {
    setSwipedCards((prev) => [...prev, card]);
  };

  const savedOpportunities = swipedCards
    .filter((c) => c.decision === "right" || c.decision === "super")
    .map((c) => c.opportunity);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser: updateUser,
        opportunities: mockOpportunities,
        swipedCards,
        addSwipe,
        savedOpportunities,
        selectedOpportunity,
        setSelectedOpportunity,
        activeTab,
        setActiveTab,
        profileSetupDone,
        setProfileSetupDone,
        cvChoice,
        setCvChoice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
