import Image from "next/image";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { db } from "@/lib/db";
import { lifestyle_posts } from "@/db/schema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lifestyle Blog",
  description: "Neha's lifestyle blog — fashion tips, makeup tutorials, skincare, and more.",
};

export const dynamic = "force-dynamic";

const categories = ["All", "Fashion", "Makeup", "Skincare", "Lifestyle", "Travel"];

const categoryColors: Record<string, string> = {
  makeup: "bg-pink-100 text-pink-700",
  fashion: "bg-purple-100 text-purple-700",
  skincare: "bg-green-100 text-green-700",
  lifestyle: "bg-amber-100 text-amber-700",
  travel: "bg-sky-100 text-sky-700",
  food: "bg-orange-100 text-orange-700",
  other: "bg-gray-100 text-gray-600",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=400&fit=crop";

export default async function LifestylePage() {
  const posts = await db
    .select()
    .from(lifestyle_posts)
    .where(eq(lifestyle_posts.published, true))
    .orderBy(desc(lifestyle_posts.published_at));

  const [featured, ...rest] = posts;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-12 text-center">
          <Badge className="mb-4 bg-brand-50 text-brand-600 border-brand-200 hover:bg-brand-50">
            Neha&apos;s Journal
          </Badge>
          <h1 className="font-display text-5xl font-bold text-gray-900 mb-4">
            Lifestyle & Inspiration
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Fashion insights, beauty secrets, and moments from Neha&apos;s creative journey.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                cat === "All"
                  ? "bg-brand-500 text-white"
                  : "bg-white text-gray-600 hover:bg-brand-50 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {posts.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="text-center py-20">
              <p className="text-gray-500">No posts published yet — check back soon.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Link href={`/lifestyle/${featured.slug}`} className="block mb-10">
                <Card className="overflow-hidden group border-0 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="grid lg:grid-cols-2">
                    <div className="relative h-72 lg:h-auto">
                      <Image
                        src={featured.cover_image || FALLBACK_IMAGE}
                        alt={featured.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="flex flex-col justify-center p-8 lg:p-12">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                            categoryColors[featured.category] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {featured.category}
                        </span>
                        <Badge className="bg-brand-50 text-brand-600 border-brand-200 hover:bg-brand-50">
                          Featured
                        </Badge>
                      </div>
                      <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-brand-600 transition-colors">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {featured.published_at && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatDate(featured.published_at)}
                          </div>
                        )}
                        <span className="text-brand-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read more <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            )}

            {/* Post grid */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post) => (
                  <Link key={post.id} href={`/lifestyle/${post.slug}`}>
                    <Card className="overflow-hidden group border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.cover_image || FALLBACK_IMAGE}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                              categoryColors[post.category] ?? "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-5 flex flex-col flex-1">
                        <h3 className="font-display font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        {post.published_at && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.published_at)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
