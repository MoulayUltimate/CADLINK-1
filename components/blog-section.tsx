import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { blogs } from "@/lib/blog-data"

export function BlogSection() {
    return (
        <section className="py-24 bg-[#F8FAFC]">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Latest from the <span className="text-[#0168A0]">CADlink Blog</span>
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Expert tips, tutorials, and industry insights to help you get the most out of your digital printing business.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {blogs.map((blog, index) => (
                            <Link
                                href={`/blog/${blog.slug}`}
                                key={index}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                                    <div className={`absolute inset-0 ${index === 0 ? 'bg-blue-50' : index === 1 ? 'bg-purple-50' : 'bg-indigo-50'}`}>
                                        <Image
                                            src={blog.image}
                                            alt={blog.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {blog.date}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {blog.readTime}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#0168A0] transition-colors">
                                        {blog.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{blog.excerpt}</p>
                                    <div className="flex items-center gap-1 text-sm font-bold text-[#0168A0] group-hover:gap-2 transition-all">
                                        Read Article <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
