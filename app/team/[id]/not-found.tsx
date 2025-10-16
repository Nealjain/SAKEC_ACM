import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserX } from "lucide-react"
import TerminalBackground from "@/components/terminal-background"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative">
      {/* Terminal Background */}
      <TerminalBackground opacity={0.8} className="!fixed" />
      
      <div className="text-center max-w-md relative z-10">
        <UserX className="w-20 h-20 text-gray-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Team Member Not Found</h1>
        <p className="text-gray-400 text-lg mb-8">
          The team member you're looking for doesn't exist or may have been removed.
        </p>
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link href="/team">Back to Team</Link>
        </Button>
      </div>
    </div>
  )
}
