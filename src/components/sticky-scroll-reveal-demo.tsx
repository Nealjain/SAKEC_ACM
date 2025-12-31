"use client";

import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { Users, BookOpen, Award } from "lucide-react";

const content = [
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-4 lg:p-8 text-white">
                    <Users className="w-8 h-8 lg:w-16 lg:h-16 mb-2 lg:mb-4" />
                    <h3 className="text-sm lg:text-3xl font-bold mb-1 lg:mb-2">Community</h3>
                    <p className="text-center text-xs lg:text-sm opacity-90">Network • Collaborate</p>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-4 lg:p-8 text-white">
                    <BookOpen className="w-8 h-8 lg:w-16 lg:h-16 mb-2 lg:mb-4" />
                    <h3 className="text-sm lg:text-3xl font-bold mb-1 lg:mb-2">Learning</h3>
                    <p className="text-center text-xs lg:text-sm opacity-90">Resources • Mentorship</p>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-4 lg:p-8 text-white">
                    <Award className="w-8 h-8 lg:w-16 lg:h-16 mb-2 lg:mb-4" />
                    <h3 className="text-sm lg:text-3xl font-bold mb-1 lg:mb-2">Recognition</h3>
                    <p className="text-center text-xs lg:text-sm opacity-90">Certificates • Awards</p>
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
