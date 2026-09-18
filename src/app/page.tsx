"use client";

import { useApp } from "@/lib/context";
import Navigation from "@/components/layout/Navigation";
import Landing from "@/components/features/Landing";
import Dashboard from "@/components/features/Dashboard";
import Discover from "@/components/features/Discover";
import Upskill from "@/components/features/Upskill";
import InterviewCoach from "@/components/features/InterviewCoach";
import CVCoach from "@/components/features/CVCoach";
import OpportunitiesMap from "@/components/features/OpportunitiesMap";
import Profile from "@/components/features/Profile";
import Onboarding from "@/components/features/Onboarding";

export default function Home() {
  const { activeTab, profileSetupDone } = useApp();

  const isLanding = activeTab === "landing";
  const isOnboarding = activeTab === "onboarding" || !profileSetupDone;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#1a1740] to-[#0f0c29]">
      {isLanding ? (
        <Landing />
      ) : isOnboarding ? (
        <Onboarding />
      ) : (
        <>
          <Navigation />
          <div className="pt-[72px] pb-[80px] px-4 max-w-lg mx-auto">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "discover" && <Discover />}
            {activeTab === "upskill" && <Upskill />}
            {activeTab === "interview" && <InterviewCoach />}
            {activeTab === "cv" && <CVCoach />}
            {activeTab === "map" && <OpportunitiesMap />}
            {activeTab === "profile" && <Profile />}
          </div>
        </>
      )}
    </main>
  );
}
