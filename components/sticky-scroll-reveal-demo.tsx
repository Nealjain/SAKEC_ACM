"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { Calendar, Users, BookOpen, Award, Code2, Lightbulb, Trophy, Rocket } from "lucide-react";

const content = [
  {
    title: "Tech Events & Workshops",
    description:
      "Participate in hackathons, coding competitions, and technical workshops. Join hands-on sessions led by industry experts and collaborate on real-world projects.",
    content: (
      <div className="relative h-full w-full overflow-hidden">
        <img
          src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/Trek%20to%20'Kothaligadh%20Fort'/trek2020_1.jpg"
          alt="Tech Events"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-8 text-white">
          <Calendar className="w-16 h-16 mb-4" />
          <h3 className="text-3xl font-bold mb-2">Tech Events</h3>
          <p className="text-center text-sm opacity-90">Hackathons • Workshops • Competitions</p>
        </div>
      </div>
    ),
  },
  {
    title: "Vibrant Community",
    description:
      "Network with peers, mentors, and industry professionals. Build lasting connections and engage in collaborative learning and peer-to-peer mentorship.",
    content: (
      <div className="relative h-full w-full overflow-hidden">
        <img
          src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/CSRA%20-Gaushala/csrGaushala2.jpg"
          alt="Community"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-8 text-white">
          <Users className="w-16 h-16 mb-4" />
          <h3 className="text-3xl font-bold mb-2">Community</h3>
          <p className="text-center text-sm opacity-90">Network • Collaborate • Grow</p>
        </div>
      </div>
    ),
  },
  {
    title: "Learning & Development",
    description:
      "Access exclusive resources, tutorials, and mentorship programs. Stay ahead with cutting-edge courses, certifications, and hands-on training sessions.",
    content: (
      <div className="relative h-full w-full overflow-hidden">
        <img
          src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/PYTHON%20PROGRAMMING%20LEARN%20IT%20WELL%20(PP)/python4.jpg"
          alt="Learning"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-8 text-white">
          <BookOpen className="w-16 h-16 mb-4" />
          <h3 className="text-3xl font-bold mb-2">Learning</h3>
          <p className="text-center text-sm opacity-90">Resources • Mentorship • Courses</p>
        </div>
      </div>
    ),
  },
  {
    title: "Recognition & Achievements",
    description:
      "Showcase your talents and earn certificates, awards, and prizes. Build a strong portfolio that stands out to employers and demonstrates your capabilities.",
    content: (
      <div className="relative h-full w-full overflow-hidden">
        <img
          src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/Triumph/triumph4.jpg"
          alt="Recognition"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-8 text-white">
          <Award className="w-16 h-16 mb-4" />
          <h3 className="text-3xl font-bold mb-2">Recognition</h3>
          <p className="text-center text-sm opacity-90">Certificates • Awards • Portfolio</p>
        </div>
      </div>
    ),
  },
];

export default function StickyScrollRevealDemo() {
  return (
    <div className="w-full">
      <StickyScroll content={content} />
    </div>
  );
}
