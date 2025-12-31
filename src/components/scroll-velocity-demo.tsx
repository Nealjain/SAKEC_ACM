"use client"

import { ScrollVelocity } from "@/components/ui/scroll-velocity"

const images = [
    {
        title: "Trek Event",
        thumbnail: "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/treak_banner_photo.jpeg",
    },
    {
        title: "AICTE Lab",
        thumbnail: "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/Sakec.aictelab11.jpg",
    },
    {
        title: "SAKEC Campus",
        thumbnail: "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/Sakec.aictelab1.jpg",
    },
    {
        title: "Trek Group",
        thumbnail: "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/treak_group.JPG",
    },
    {
        title: "Trek Event 2",
        thumbnail: "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/treak_banner_photo.jpeg",
    },
    {
        title: "AICTE Lab 2",
        thumbnail: "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/Sakec.aictelab11.jpg",
    },
    {
        title: "SAKEC Campus 2",
        thumbnail: "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/Sakec.aictelab1.jpg",
    },
    {
        title: "Trek Group 2",
        thumbnail: "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/treak_group.JPG",
    },
]

const velocity = [3, -3]

function ScrollVelocityDemo() {
    return (
        <div className="w-full">
            <div className="flex flex-col space-y-5 py-10">
                {velocity.map((v, index) => (
                    <ScrollVelocity key={index} velocity={v}>
                        {images.map(({ title, thumbnail }) => (
                            <div
                                key={title}
                                className="relative h-[6rem] w-[9rem] md:h-[8rem] md:w-[12rem] xl:h-[12rem] xl:w-[18rem]"
                            >
                                <img
                                    src={thumbnail}
                                    alt={title}
                                    className="h-full w-full object-cover object-center rounded-lg"
                                />
                            </div>
                        ))}
                    </ScrollVelocity>
                ))}
                <ScrollVelocity velocity={5}>
                    <span className="text-gray-900">SAKEC ACM Student Chapter</span>
                </ScrollVelocity>
            </div>
        </div>
    )
}

export { ScrollVelocityDemo }
