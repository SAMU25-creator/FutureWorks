"use client";

import { ChangeEvent, useState } from "react";
import { useApp } from "@/lib/context";
import { ArrowLeft, ArrowRight, Check, FileText, Loader2, Sparkles, UserRound } from "lucide-react";
import { Education, UserProfile } from "@/types";

type CvSource = "existing" | "none" | null;

const emptyEducation: Education = { qualification: "", institution: "", year: "", field: "" };
const CAREER_FIELDS = [
  "Business & Entrepreneurship", "Finance & Accounting", "Healthcare & Nursing", "Education & Teaching",
  "Engineering & Construction", "Science & Research", "Law & Public Service", "Marketing & Communications",
  "Sales & Customer Service", "Design & Creative Arts", "Hospitality & Tourism", "Agriculture & Environment",
  "Transport & Logistics", "Skilled Trades & Manufacturing", "Technology & Software", "Other career",
];
const knownSkills = ["Python", "JavaScript", "Java", "SQL", "HTML/CSS", "React", "Git", "Excel", "Data Analysis", "Communication", "Teamwork", "Problem-solving", "Figma", "Node.js", "TypeScript", "Microsoft Office"];

async function extractPdfText(file: File) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
  }
  return pages.join("\n");
}

async function extractDocxText(file: File) {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
}

function profileFromCvText(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/[\u0000-\u001F\u007F\uFFFD]/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const email = text.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] ?? "";
  const skills = knownSkills.filter((skill) => text.toLowerCase().includes(skill.toLowerCase()));
  const educationLine = lines.find((line) => /education|degree|diploma|certificate|matric|school|university|college/i.test(line));
  const skillLine = lines.findIndex((line) => /^skills?$/i.test(line));
  const background = lines.filter((line) => !line.includes(email) && line !== educationLine).slice(0, 12).join(" ");
  const name = lines.find((line) =>
    !line.includes("@") &&
    !/curriculum|resume|cv|exif|metadata|version|creator|producer/i.test(line) &&
    /^[A-Za-z][A-Za-z.' -]{1,59}$/.test(line),
  ) ?? "";
  return {
    name,
    email,
    skills: skills.join(", "),
    education: educationLine?.replace(/^education\s*:?\s*/i, "") ?? "",
    background: skillLine >= 0 ? lines.slice(skillLine + 1, skillLine + 5).join(" ") : background,
  };
}

export default function Onboarding() {
  const { setUser, setActiveTab, setProfileSetupDone, setCvChoice } = useApp();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [account, setAccount] = useState({ name: "", email: "", password: "" });
  const [cvSource, setCvSource] = useState<CvSource>(null);
  const [cvFile, setCvFile] = useState("");
  const [readingCv, setReadingCv] = useState(false);
  const [details, setDetails] = useState({ city: "", careerGoal: "", skills: "", background: "", interests: "" });
  const [education, setEducation] = useState<Education>(emptyEducation);

  const nextFromAccount = () => {
    setError("");
    if (!account.name.trim() || !account.email.trim() || account.password.length < 6) {
      setError("Enter your name, a valid email, and a password with at least 6 characters.");
      return;
    }
    setStep(2);
  };

  const handleCvUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setCvFile(file.name);
    setReadingCv(true);
    try {
      const extension = file.name.toLowerCase().split(".").pop();
      const text = extension === "pdf" ? await extractPdfText(file) : extension === "doc" || extension === "docx" ? await extractDocxText(file) : await file.text();
      const imported = profileFromCvText(text);
      setDetails((current) => ({ ...current, skills: imported.skills || current.skills, background: imported.background || current.background }));
      if (imported.education) setEducation((current) => ({ ...current, qualification: imported.education }));
      setCvSource("existing");
    } catch {
      setCvSource("existing");
      setError("The CV was uploaded, but its text could not be read automatically. You can complete the fields manually.");
    } finally {
      setReadingCv(false);
    }
  };

  const chooseNoCv = () => {
    setCvSource("none");
    setCvFile("");
    setError("");
    setStep(3);
  };

  const continueWithCv = () => {
    if (!cvFile) {
      setError("Choose a CV file first, or select that you do not have one.");
      return;
    }
    if (readingCv) return;
    setStep(3);
  };

  const finish = () => {
    setError("");
    if (!details.city.trim() || !details.careerGoal.trim() || !details.skills.trim()) {
      setError("Add your location, career goal, and at least one skill to continue.");
      return;
    }
    const skills = details.skills.split(",").map((skill) => skill.trim()).filter(Boolean);
    const interests = details.interests.split(",").map((interest) => interest.trim()).filter(Boolean);
    const background = details.background.trim();
    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      name: account.name.trim(),
      email: account.email.trim(),
      location: { city: details.city.trim(), lat: -26.2041, lng: 28.0473 },
      education: education.qualification.trim() ? [{ ...education, field: education.field?.trim() }] : [],
      skills,
      certifications: [],
      experience: background ? [{ title: "Professional background", company: "Provided by user", duration: "", description: background }] : [],
      interests,
      careerGoal: details.careerGoal.trim(),
      profileComplete: 100,
      coursesCompleted: 0,
      applicationsCount: 0,
      interviewReadiness: 0,
    };
    setUser(profile);
    setCvChoice(cvSource === "existing" ? "existing" : "generated");
    setProfileSetupDone(true);
    setActiveTab(cvSource === "none" ? "cv" : "dashboard");
  };

  return (
    <main className="min-h-screen px-5 py-10 max-w-lg mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-brand-300 text-sm font-semibold mb-4"><UserRound className="w-4 h-4" /> Create your FutureWorks profile</div>
        <div className="flex gap-2 mb-5">{[1, 2, 3].map((item) => <div key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? "bg-brand-400" : "bg-white/10"}`} />)}</div>
        <p className="text-white/40 text-xs">Step {step} of 3</p>
        <h1 className="text-white text-3xl font-bold mt-1">{step === 1 ? "Start with your account" : step === 2 ? "Do you have a CV?" : "Tell us about you"}</h1>
        <p className="text-white/60 text-sm mt-2">{step === 1 ? "Your workspace is created for you in real time." : step === 2 ? "We will use it to prefill your profile and make it ATS-compatible." : cvSource === "existing" ? "We imported what we could from your CV. Review and complete the details before we optimise it." : "Add your details and we will generate an ATS-friendly CV for you."}</p>
      </div>

      {step === 1 && <div className="space-y-4">
        <label className="block text-white/70 text-sm">Full name<input value={account.name} onChange={(event) => setAccount({ ...account, name: event.target.value })} className="input-field mt-2" placeholder="Your full name" /></label>
        <label className="block text-white/70 text-sm">Email address<input type="email" value={account.email} onChange={(event) => setAccount({ ...account, email: event.target.value })} className="input-field mt-2" placeholder="you@example.com" /></label>
        <label className="block text-white/70 text-sm">Password<input type="password" value={account.password} onChange={(event) => setAccount({ ...account, password: event.target.value })} className="input-field mt-2" placeholder="At least 6 characters" /></label>
      </div>}

      {step === 2 && <div className="space-y-4">
        <div className="glass-card p-5 border border-brand-500/30 bg-brand-900/20">
          <div className="flex items-start gap-3"><FileText className="w-5 h-5 text-brand-300 mt-0.5" /><div><p className="text-white font-semibold">I have a CV</p><p className="text-white/50 text-sm mt-1">Upload PDF, Word, or text. We will extract your details and prepare an ATS-compatible version.</p></div></div>
          <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleCvUpload} className="mt-4 w-full text-xs text-white/50 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-500/20 file:px-3 file:py-2 file:text-brand-300" />
          {cvFile && <p className="text-green-400 text-xs mt-2 flex items-center gap-1">{readingCv ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}{readingCv ? "Reading your CV..." : `${cvFile} uploaded`}</p>}
          <button onClick={continueWithCv} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">Use this CV <ArrowRight className="w-4 h-4" /></button>
        </div>
        <button onClick={chooseNoCv} className="glass-card-hover w-full p-5 text-left border border-white/10"><div className="flex items-start gap-3"><Sparkles className="w-5 h-5 text-brand-300 mt-0.5" /><div><p className="text-white font-semibold">I do not have a CV</p><p className="text-white/50 text-sm mt-1">Tell us about yourself next and we will generate an ATS-friendly CV.</p></div></div></button>
      </div>}

      {step === 3 && <div className="space-y-4">
        {cvSource === "existing" && <div className="glass-card p-4 bg-green-500/10 border-green-500/30"><p className="text-green-300 text-sm font-medium">CV imported</p><p className="text-white/60 text-xs mt-1">Check the imported details below. Your final CV will be rewritten for ATS compatibility.</p></div>}
        <label className="block text-white/70 text-sm">Where are you based?<input value={details.city} onChange={(event) => setDetails({ ...details, city: event.target.value })} className="input-field mt-2" placeholder="City, country" /></label>
        <label className="block text-white/70 text-sm">What career field are you working towards?<select value={CAREER_FIELDS.includes(details.careerGoal) ? details.careerGoal : details.careerGoal ? "Other career" : ""} onChange={(event) => setDetails({ ...details, careerGoal: event.target.value === "Other career" ? "" : event.target.value })} className="input-field mt-2"><option value="" disabled>Select a career field</option>{CAREER_FIELDS.map((field) => <option key={field} value={field}>{field}</option>)}</select></label>
        {!CAREER_FIELDS.includes(details.careerGoal) && <label className="block text-white/70 text-sm">Your specific career goal<input value={details.careerGoal} onChange={(event) => setDetails({ ...details, careerGoal: event.target.value })} className="input-field mt-2" placeholder="e.g. Nurse, Chef, Civil Engineer, Photographer" /></label>}
        <label className="block text-white/70 text-sm">Skills <span className="text-white/40">(comma separated)</span><input value={details.skills} onChange={(event) => setDetails({ ...details, skills: event.target.value })} className="input-field mt-2" placeholder="e.g. Excel, Python, Communication" /></label>
        <label className="block text-white/70 text-sm">Education <span className="text-white/40">(optional)</span><input value={education.qualification} onChange={(event) => setEducation({ ...education, qualification: event.target.value })} className="input-field mt-2" placeholder="Qualification or school-leaving certificate" /></label>
        {education.qualification && <div className="grid grid-cols-2 gap-3"><input value={education.institution} onChange={(event) => setEducation({ ...education, institution: event.target.value })} className="input-field" placeholder="Institution" /><input value={education.year} onChange={(event) => setEducation({ ...education, year: event.target.value })} className="input-field" placeholder="Year" /></div>}
        <label className="block text-white/70 text-sm">Work or life background <span className="text-white/40">(optional)</span><textarea value={details.background} onChange={(event) => setDetails({ ...details, background: event.target.value })} className="input-field mt-2 min-h-24 resize-y" placeholder="Projects, volunteering, responsibilities, or experience" /></label>
        <label className="block text-white/70 text-sm">Interests <span className="text-white/40">(optional, comma separated)</span><input value={details.interests} onChange={(event) => setDetails({ ...details, interests: event.target.value })} className="input-field mt-2" placeholder="e.g. Technology, Design" /></label>
      </div>}

      {error && <p className="text-red-300 text-sm mt-4">{error}</p>}
      <div className="flex gap-3 mt-8">
        {step > 1 && <button onClick={() => { setError(""); setStep((current) => current - 1); }} className="btn-secondary flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>}
        {step === 1 && <button onClick={nextFromAccount} className="btn-primary flex-1 flex items-center justify-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button>}
        {step === 3 && <button onClick={finish} className="btn-primary flex-1 flex items-center justify-center gap-2">Create ATS CV <Sparkles className="w-4 h-4" /></button>}
      </div>
      {step === 3 && <p className="text-white/35 text-xs text-center mt-5 flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Your profile stays in this live demo session</p>}
    </main>
  );
}
