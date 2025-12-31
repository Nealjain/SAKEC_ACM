"use client";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";

export function ScrollBasedVelocityDemo() {
    return (
        <section className="py-20 overflow-hidden">
            <VelocityScroll
                text="SAKEC ACM • INNOVATE • COLLABORATE • CODE • LEARN • BUILD •"
                default_velocity={3}
                className="font-display text-center text-3xl font-bold tracking-[-0.02em] text-gray-900 md:text-6xl md:leading-[4rem]"
            />
        </section>
    );
}
