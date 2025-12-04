
import { motion } from 'framer-motion'
import { CheckCircle2, Users, Rocket, Brain, Trophy, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const benefits = [
    {
        icon: <Users className="w-6 h-6 text-blue-500" />,
        title: "Networking Opportunities",
        description: "Connect with like-minded peers, industry professionals, and alumni who share your passion for technology."
    },
    {
        icon: <Rocket className="w-6 h-6 text-purple-500" />,
        title: "Skill Development",
        description: "Gain hands-on experience through workshops, hackathons, and projects that go beyond the classroom curriculum."
    },
    {
        icon: <Brain className="w-6 h-6 text-pink-500" />,
        title: "Technical Growth",
        description: "Access exclusive resources, technical talks, and mentorship programs to accelerate your learning journey."
    },
    {
        icon: <Trophy className="w-6 h-6 text-yellow-500" />,
        title: "Competitions & Events",
        description: "Participate in coding contests, hackathons, and tech quizzes to test your skills and win exciting prizes."
    },
    {
        icon: <Globe className="w-6 h-6 text-green-500" />,
        title: "Global Community",
        description: "Be part of the world's largest educational and scientific computing society with access to global resources."
    },
    {
        icon: <CheckCircle2 className="w-6 h-6 text-indigo-500" />,
        title: "Leadership Experience",
        description: "Take up leadership roles, organize events, and develop soft skills that are crucial for your career."
    }
]

export default function WhyJoin() {
    return (
        <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900"
                >
                    Why Join SAKEC ACM?
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
                >
                    Unlock your potential and shape your future with the premier student chapter for computing professionals.
                </motion.p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {benefits.map((benefit, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="bg-white rounded-xl w-12 h-12 flex items-center justify-center shadow-sm mb-4">
                            {benefit.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">{benefit.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* CTA Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#4f46e5_0%,transparent_40%)] opacity-50" />
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start your journey?</h2>
                    <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                        Join a community of innovators, creators, and future leaders. Your journey to excellence starts here.
                    </p>
                    <Link to="/contact">
                        <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8">
                            Join Now
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
