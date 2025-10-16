import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Lightbulb, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="text-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            ACM, the Association for Computing Machinery, is the worlds largest educational and scientific computing society. ACM delivers resources that advance computing as a science and a profession. ACM’s Regional Councils provide grassroots support on a global scale. Based in US, Europe, India, and China, they raise awareness, visibility and relevance of ACM by sponsoring high-quality conferences, expanding chapters, and encouraging greater participation in all dimensions of the society.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-gray-900/70 border-gray-800">
              <CardContent className="p-8">
                <Target className="w-12 h-12 text-white mb-6" />
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-300 leading-relaxed">
                  To impart high quality technical education to the students by providing an excellent academic
                  environment, well-equipped laboratories and training through the motivated teachers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/70 border-gray-800">
              <CardContent className="p-8">
                <Lightbulb className="w-12 h-12 text-white mb-6" />
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-gray-300 leading-relaxed">
                  To become a globally recognized institution offering quality education and enhancing professional standards.
                  We envision a community where students can explore, and contribute to the advancement of computing technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4 bg-gray-900/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What We Do</h2>
            <p className="text-xl text-gray-400">Empowering students through diverse activities and initiatives</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Workshops</h3>
              <p className="text-gray-400">Regular technical workshops on cutting-edge technologies</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Competitions</h3>
              <p className="text-gray-400">Coding contests and hackathons to challenge your skills</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-400">Project showcases and innovation challenges</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Networking</h3>
              <p className="text-gray-400">Connect with industry professionals and alumni</p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      {/*<section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-gray-400">A brief history of our chapter</p>
          </div>

          <div className="space-y-8">
            <div className="border-l-2 border-white pl-8">
              <h3 className="text-2xl font-semibold mb-2">2025 - Revival of ACM Cell</h3>
              <p className="text-gray-300">
                Revived the Club to continue the legacy of the ACM Student Chapter.
              </p>
            </div>

            <div className="border-l-2 border-gray-600 pl-8">
              <h3 className="text-2xl font-semibold mb-2">2019 - Recognition</h3>
              <p className="text-gray-300">
               Received recognition from ACM International and established partnerships with leading tech companies.
              </p>
            </div>

            <div className="border-l-2 border-gray-600 pl-8">
              <h3 className="text-2xl font-semibold mb-2">2018 - Growth</h3>
              <p className="text-gray-300">
                 Expanded our activities with regular workshops, guest lectures, and our first annual coding competition.
              </p>
            </div>

            <div className="border-l-2 border-gray-600 pl-8">
              <h3 className="text-2xl font-semibold mb-2">2017 - Foundation</h3>
              <p className="text-gray-300">
                The SAKEC ACM Student Chapter was established on 11th April, 2017 with a vision to create a platform for students to explore
                and excel in computer science.
              </p>
            </div>
          </div>
        </div>
      </section>*/}
    </div>
  )
}
