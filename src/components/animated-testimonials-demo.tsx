import { useEffect, useState } from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { getTestimonials } from "@/lib/testimonials";
import type { Testimonial } from "@/lib/types";

export default function AnimatedTestimonialsDemo() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const data = await getTestimonials();
        // Map testimonials to the format expected by AnimatedTestimonials
        const testimonialsData = data.map((testimonial: Testimonial) => ({
          quote: testimonial.quote,
          name: testimonial.name,
          designation: testimonial.position,
          src: testimonial.image_url,
        }));
        
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // Fallback to empty array if fetch fails
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-700">Loading testimonials...</div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-700">No testimonials available at the moment.</div>
      </div>
    );
  }

  return <AnimatedTestimonials testimonials={testimonials} autoplay={true} />;
}
