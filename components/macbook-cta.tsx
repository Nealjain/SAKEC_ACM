"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"

export default function MacbookCTA() {
  return (
    <div className="relative w-full py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        {/* Content Above MacBook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            Experience Innovation
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join SAKEC ACM and be part of a community that's shaping the future of technology
          </p>
        </motion.div>

        {/* MacBook Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-5xl"
        >
          {/* MacBook Screen */}
          <div className="relative rounded-t-xl bg-gray-900 border-2 border-gray-800 overflow-hidden shadow-2xl">
            {/* Screen Content */}
            <div className="aspect-[16/10] bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 p-8 flex flex-col items-center justify-center">
              <img
                src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/treak_group.JPG"
                alt="SAKEC ACM"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            {/* Camera Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full" />
          </div>

          {/* MacBook Base */}
          <div className="relative h-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          </div>

          {/* Shadow */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-purple-600/20 blur-3xl rounded-full" />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-16"
        >
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8">
            <Link href="/contact">Join Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10 text-lg px-8">
            <Link href="/events">View Events</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
