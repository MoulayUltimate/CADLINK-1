import { blogs } from "@/lib/blog-data"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
    return blogs.map((post) => ({
        slug: post.slug,
    }))
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = blogs.find((b) => b.slug === slug)

    if (!post) {
        notFound()
    }

    const otherPosts = blogs.filter((b) => b.slug !== slug).slice(0, 2)

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-12 pb-24">
                <article className="container mx-auto px-4 max-w-4xl">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0168A0] mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>

                    <header className="mb-12 text-center">
                        <div className="flex items-center justify-center gap-4 text-sm font-bold text-gray-400 mb-6 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {post.date}
                            </div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full" />
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {post.readTime}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">{post.title}</h1>
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg">
                            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
                        </div>
                    </header>

                    <div
                        className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#0168A0] prose-strong:text-gray-900 prose-img:rounded-2xl"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <hr className="my-16 border-gray-100" />

                    <div className="bg-[#F8FAFC] rounded-3xl p-8 md:p-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8">Read Next</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            {otherPosts.map((blog, index) => (
                                <Link
                                    href={`/blog/${blog.slug}`}
                                    key={index}
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={blog.image || "/placeholder.svg"}
                                            alt={blog.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0168A0] transition-colors">
                                            {blog.title}
                                        </h4>
                                        <div className="flex items-center gap-1 text-sm font-bold text-[#0168A0] group-hover:gap-2 transition-all">
                                            Read Article <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    )
}
