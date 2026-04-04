"use client"

import { useTranslation } from "@/contexts/translation-context"

export function VideoSection() {
    const t = useTranslation()

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            {t.video?.title_prefix} <span className="text-[#0168A0]">{t.video?.title_highlight}</span> {t.video?.title_suffix}
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            {t.video?.description}
                        </p>
                    </div>

                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-black">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/icBuHvMQcIY?autoplay=1&mute=1&start=30&loop=1&playlist=icBuHvMQcIY&controls=1&rel=0"
                            title="Cadlink Digital Factory V11 Demo"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
