"use client";

import { useState } from "react";
import {
  Briefcase,
  BookOpen,
  Award,
  Users,
  Lightbulb,
  Network,
} from "lucide-react";
import { CareerSupportModal } from "@/components/ui/CareerSupportModal";
import type { SubmissionType } from "@/types";

const SUPPORT_TYPES: Array<{
  type: SubmissionType;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  cta: string;
}> = [
  {
    type: "internship",
    icon: Briefcase,
    title: "Refer Internship Opportunities",
    desc: "Know of internship openings, graduate trainee programs, apprenticeships, or entry-level technical roles? A referral can make all the difference.",
    cta: "Refer an Opportunity",
  },
  {
    type: "learning_resource",
    icon: BookOpen,
    title: "Recommend Learning Resources",
    desc: "Share courses, books, YouTube channels, technical blogs, study roadmaps, or practice platforms that have helped you or others succeed.",
    cta: "Share a Resource",
  },
  {
    type: "certification",
    icon: Award,
    title: "Suggest Certifications",
    desc: "Recommend certifications in data engineering, cloud computing, analytics, software engineering, cybersecurity, or AI.",
    cta: "Recommend a Certification",
  },
  {
    type: "mentorship",
    icon: Users,
    title: "Offer Mentorship",
    desc: "Experienced in Python, data engineering, analytics, or software development? I would appreciate career advice, technical feedback, and industry insights.",
    cta: "Become a Mentor",
  },
  {
    type: "project_idea",
    icon: Lightbulb,
    title: "Share Project Ideas",
    desc: "Have ideas for data projects, open-source contributions, civic technology solutions, automation tools, or analytics dashboards? Send them my way.",
    cta: "Submit a Project Idea",
  },
  {
    type: "networking",
    icon: Network,
    title: "Connect With Me",
    desc: "Let's build a meaningful professional relationship. Whether you're a developer, recruiter, data professional, or tech enthusiast — I'd love to connect.",
    cta: "Connect",
  },
];

export default function CareerSupportSection() {
  const [activeType, setActiveType] = useState<SubmissionType | null>(null);

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUPPORT_TYPES.map(({ type, icon: Icon, title, desc, cta }) => (
          <div key={type} className="card flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-mist border border-rule flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-stone-500" />
              </div>
              <h3 className="font-semibold text-ink text-sm leading-tight">
                {title}
              </h3>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed flex-1 mb-4">
              {desc}
            </p>
            <button
              className="btn-secondary text-xs w-full"
              onClick={() => setActiveType(type)}
            >
              {cta} →
            </button>
          </div>
        ))}
      </div>

      {activeType && (
        <CareerSupportModal
          type={activeType}
          onClose={() => setActiveType(null)}
        />
      )}
    </>
  );
}
