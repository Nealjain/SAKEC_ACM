"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { Calendar, Users, BookOpen, Award, Code2, Lightbulb, Trophy, Rocket } from "lucide-react";

const content = [
  {
    title: "Tech Events & Workshops",
    description:
      "Participate in hackathons, coding competitions, and technical workshops designed to sharpen your skills. Join hands-on sessions led by industry experts and collaborate with fellow students on real-world projects. From beginner-friendly introductions to advanced masterclasses, we offer events that cater to all skill levels and help you stay ahead in the rapidly evolving tech landscape.",
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
      "Network with peers, mentors, and industry professionals who share your passion for technology. Build lasting connections that will help shape your career and open doors to new opportunities. Engage in collaborative learning, knowledge sharing, and peer-to-peer mentorship. Our community is a supportive environment where everyone from beginners to experts can learn, grow, and thrive together.",
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
      "Access exclusive resources, tutorials, and comprehensive mentorship programs tailored to your learning journey. Stay ahead with cutting-edge technology courses, certifications, and hands-on training sessions. Get personalized guidance from experienced mentors who are invested in your success. Whether you're learning your first programming language or mastering advanced concepts, we provide the resources and support you need.",
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
      "Showcase your talents and earn certificates, awards, and prizes that validate your skills. Participate in competitions and get recognized for your achievements at local, national, and international levels. Build a strong portfolio that stands out to employers and demonstrates your capabilities. Your accomplishments with ACM become valuable credentials that enhance your resume and professional profile.",
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
