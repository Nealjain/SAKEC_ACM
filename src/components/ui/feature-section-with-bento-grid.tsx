import { Code2, Rocket, Trophy, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function Feature() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge variant="outline" className="border-blue-500/40 text-blue-600">
                What We Offer
              </Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left text-gray-900">
                Empowering Future Tech Leaders
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-gray-600 text-left">
                Join a vibrant community of innovators, learners, and creators shaping the future of technology
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Large card - Hands-on Projects */}
            <div className="backdrop-blur-xl bg-white/60 border border-black/10 rounded-2xl h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col hover:border-blue-500/40 hover:bg-white/80 transition-all shadow-sm hover:shadow-md">
              <Code2 className="w-8 h-8 stroke-1 text-blue-600" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight font-bold text-gray-900 mb-2">
                  Hands-on Projects
                </h3>
                <p className="text-gray-600 max-w-xs text-base">
                  Build real-world applications and gain practical experience through collaborative projects and workshops
                </p>
              </div>
            </div>

            {/* Career Growth */}
            <div className="backdrop-blur-xl bg-white/60 border border-black/10 rounded-2xl aspect-square p-6 flex justify-between flex-col hover:border-purple-500/40 hover:bg-white/80 transition-all shadow-sm hover:shadow-md">
              <Rocket className="w-8 h-8 stroke-1 text-purple-600" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight font-bold text-gray-900 mb-2">
                  Career Growth
                </h3>
                <p className="text-gray-600 max-w-xs text-base">
                  Access internships and job opportunities from top companies
                </p>
              </div>
            </div>

            {/* Competitions */}
            <div className="backdrop-blur-xl bg-white/60 border border-black/10 rounded-2xl aspect-square p-6 flex justify-between flex-col hover:border-pink-500/40 hover:bg-white/80 transition-all shadow-sm hover:shadow-md">
              <Trophy className="w-8 h-8 stroke-1 text-pink-600" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight font-bold text-gray-900 mb-2">
                  Competitions
                </h3>
                <p className="text-gray-600 max-w-xs text-base">
                  Participate in coding contests and win exciting prizes
                </p>
              </div>
            </div>

            {/* Large card - Innovation */}
            <div className="backdrop-blur-xl bg-white/60 border border-black/10 rounded-2xl h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col hover:border-orange-500/40 hover:bg-white/80 transition-all shadow-sm hover:shadow-md">
              <Sparkles className="w-8 h-8 stroke-1 text-orange-600" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight font-bold text-gray-900 mb-2">
                  Innovation
                </h3>
                <p className="text-gray-600 max-w-xs text-base">
                  Turn your ideas into reality with our support and resources. Get mentorship and funding for your projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
