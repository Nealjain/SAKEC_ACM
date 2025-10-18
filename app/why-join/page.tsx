"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  Lightbulb,
  Award,
  BookOpen,
  Network,
  Briefcase,
  Code,
  Trophy,
  CheckCircle,
} from "lucide-react"
import MembershipFormScript from "@/components/membership-form-script"
import AnimatedTestimonialsDemo from "@/components/animated-testimonials-demo"

export default function WhyJoinPage() {
  const benefits = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Vibrant Community",
      description:
        "Join a network of passionate students and professionals who share your interests in technology.",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation Opportunities",
      description:
        "Work on projects and participate in hackathons to bring your ideas to life.",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Skill Development",
      description:
        "Access workshops, tutorials, and mentorship programs to enhance your technical skills.",
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Professional Network",
      description:
        "Connect with industry professionals, alumni, and potential employers.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Recognition",
      description:
        "Gain recognition for your contributions and achievements within the ACM community.",
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Career Opportunities",
      description:
        "Access exclusive job opportunities and internships through our industry partnerships.",
    },
  ]

  const activities = [
    "Technical Workshops & Seminars",
    "Coding Competitions & Hackathons",
    "Guest Lectures by Industry Experts",
    "Project Collaboration Opportunities",
    "Research Paper Presentations",
    "Trekking & Adventure Activities",
    "Mentorship Programs",
    "Open Source Contributions",
  ]

  return (
    <div className="text-white min-h-screen pt-20">
      <MembershipFormScript />
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Why Join Us?</h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            Discover the countless opportunities and benefits of being part of
            the SAKEC ACM Student Chapter
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-gray-200"
          >
            <Link href="/contact">Join Now</Link>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Member Benefits</h2>
            <p className="text-xl text-gray-400">
              What you'll gain as a member of our chapter
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="bg-gray-900/70 border-gray-800 hover:border-gray-700 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="text-white mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Combined Activities & Membership Section */}
      <section className="py-16 px-4 bg-gray-900/70">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* What We Do */}
            <div>
              <div className="mb-8">
                <h2 className="text-4xl font-bold mb-6">What We Do</h2>
                <p className="text-xl text-gray-400">
                  Our chapter organizes diverse activities designed to enhance
                  your learning experience and professional growth.
                </p>
              </div>

              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-gray-300">{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Membership Card */}
            <div>
              <div className="mb-8">
                <h2 className="text-4xl font-bold mb-4">Membership Options</h2>
                <p className="text-xl text-gray-400">
                  Choose the membership that fits your goals
                </p>
              </div>

              <Card className="bg-gray-900/70 border-gray-800">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">General Members</h3>
                  <p className="text-gray-400 mb-6">Who? All interested students.</p>
                  <ul className="text-left space-y-2 mb-8">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Participate in SAKEC ACM events</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Attend workshops, hackathons & seminars.</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Networking with peers & alumni.</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Contact Us : +91 97694 99353 </span>
                    </li>
                  </ul>
                  <Button
                    asChild
                    className="w-full bg-white text-black hover:bg-gray-200"
                  >
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLScuYGOzXMET5aiHGb5gGee8PKyTrO_fjS7sjj9PUEwh2J0o5A/viewform"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Now for ₹400/year
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Leaders Say</h2>
            <p className="text-xl text-gray-400">Hear from our team about their ACM experience</p>
          </div>
          <AnimatedTestimonialsDemo />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join hundreds of students who are already advancing their careers
            with SAKEC ACM
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-200"
            >
              <Link href="/contact">Join Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              <Link href="/events">View Upcoming Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
