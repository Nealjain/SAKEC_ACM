import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "Being part of SAKEC ACM has been transformative. The workshops and mentorship programs have helped me grow both technically and professionally. The community here is incredibly supportive and inspiring.",
      name: "Neal Jain",
      designation: "Technical Head, SAKEC ACM",
      src: "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/team-photos/Again%20photos/neal.JPG",
    },
    {
      quote:
        "ACM has provided me with countless opportunities to learn, network, and lead. The hands-on experience with real-world projects has been invaluable for my career development.",
      name: "Nihaar Kotak",
      designation: "Membership Chairperson, SAKEC ACM",
      src: "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/team-photos/Again%20photos/nihaar.jpg",
    },
    {
      quote:
        "The collaborative environment at ACM has helped me discover my passion for technology. Working with talented peers and mentors has accelerated my learning journey significantly.",
      name: "Viya Punmiya",
      designation: "Publicity Head, SAKEC ACM",
      src: "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/team-photos/Again%20photos/viya.jpg",
    },
    {
      quote:
        "ACM has been instrumental in shaping my technical skills and leadership abilities. The events and competitions have pushed me to constantly improve and innovate.",
      name: "Manali Patil",
      designation: "Treasurer, SAKEC ACM",
      src: "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/team-photos/Again%20photos/manali.jpg",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} autoplay={true} />;
}
