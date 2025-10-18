import { createClient } from "@/lib/supabase/client-only";

export interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  display_order: number;
  is_active: boolean;
}

// Fetch all active carousel images ordered by display_order
export async function getCarouselImages(): Promise<CarouselImage[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from("carousel_images")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    
    if (error) {
      return fallbackCarouselImages;
    }
    
    return data as CarouselImage[];
  } catch (e) {
    return fallbackCarouselImages;
  }
}

// Fallback carousel images in case database is not available
export const fallbackCarouselImages: CarouselImage[] = [
  {
    id: "1",
    src: "/coding-workshop-students.png",
    alt: "Coding Workshop",
    display_order: 1,
    is_active: true,
  },
  {
    id: "2",
    src: "/tech-community-meeting.png",
    alt: "Tech Community",
    display_order: 2,
    is_active: true,
  },
  {
    id: "3",
    src: "/hackathon-competition.png",
    alt: "Competitions",
    display_order: 3,
    is_active: true,
  },
  {
    id: "4",
    src: "/placeholder-n0pwc.png",
    alt: "Innovation Hub",
    display_order: 4,
    is_active: true,
  },
];