import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Lightbulb, Award, Mail } from "lucide-react"
import TimelineDemo from "@/components/timeline-demo"
import AnimatedTestimonialsDemo from "@/components/animated-testimonials-demo"

export default function About() {
  return (
    <div className="text-gray-900 min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">About Us</h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            ACM, the Association for Computing Machinery, is the worlds largest educational and scientific computing society. ACM delivers resources that advance computing as a science and a profession. ACM’s Regional Councils provide grassroots support on a global scale. Based in US, Europe, India, and China, they raise awareness, visibility and relevance of ACM by sponsoring high-quality conferences, expanding chapters, and encouraging greater participation in all dimensions of the society.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <Target className="w-12 h-12 text-blue-600 mb-6" />
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed">
                  To impart high quality technical education to the students by providing an excellent academic
                  environment, well-equipped laboratories and training through the motivated teachers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <Lightbulb className="w-12 h-12 text-purple-600 mb-6" />
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Vision</h2>
                <p className="text-gray-700 leading-relaxed">
                  To become a globally recognized institution offering quality education and enhancing professional standards.
                  We envision a community where students can explore, and contribute to the advancement of computing technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">What We Do</h2>
            <p className="text-xl text-gray-700">Empowering students through diverse activities and initiatives</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Workshops</h3>
              <p className="text-gray-700">Regular technical workshops on cutting-edge technologies</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Competitions</h3>
              <p className="text-gray-700">Coding contests and hackathons to challenge your skills</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Innovation</h3>
              <p className="text-gray-700">Project showcases and innovation challenges</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Networking</h3>
              <p className="text-gray-700">Connect with industry professionals and alumni</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4">
        <TimelineDemo />
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">What Our Leaders Say</h2>
            <p className="text-xl text-gray-700">Hear from our team about their ACM experience</p>
          </div>
          <AnimatedTestimonialsDemo />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8 md:p-12 text-center shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Have Questions?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              We're here to help! Reach out to us for any queries, collaborations, or support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:support@sakec.acm.org"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <Mail className="w-5 h-5" />
                support@sakec.acm.org
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border border-gray-300 transition-all shadow-sm hover:shadow-md"
              >
                Contact Form
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
