import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Calendar, Users, BookOpen, Award } from "lucide-react"
import { SimpleHero } from "@/components/simple-hero"

export default function HomePage() {
  return (
    <div className="text-white relative">
      {/* Simple Hero Section */}
      <SimpleHero />

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover opportunities to grow, learn, and connect with fellow technology enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-900/70 border-gray-800 hover:border-gray-700 transition-colors">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tech Events</h3>
                <p className="text-gray-400">Regular workshops, seminars, and competitions to enhance your skills</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/70 border-gray-800 hover:border-gray-700 transition-colors">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-400">Connect with like-minded peers and industry professionals</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/70 border-gray-800 hover:border-gray-700 transition-colors">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Learning</h3>
                <p className="text-gray-400">Access to resources, tutorials, and mentorship programs</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/70 border-gray-800 hover:border-gray-700 transition-colors">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Recognition</h3>
                <p className="text-gray-400">Opportunities to showcase your talents and win exciting prizes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-transparent relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Take the first step towards advancing your career in computer science
          </p>
          <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200">
            <Link href="/contact">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
