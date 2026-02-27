import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lifestyle Blog",
  description: "Neha's lifestyle blog — fashion tips, makeup tutorials, skincare, and more.",
};

const categories = ["All", "Fashion", "Makeup", "Skincare", "Lifestyle", "Travel"];

const posts = [
  {
    id: "1",
    title: "5 Bridal Makeup Trends Dominating This Wedding Season",
    excerpt: "From dewy skin to bold lip colours, discover the looks that are making brides shine in 2025.",
    cover_image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=400&fit=crop",
    category: "Makeup",
    tags: ["bridal", "trends", "2025"],
    published_at: "2025-01-15",
  },
  {
    id: "2",
    title: "How to Style an Anarkali for Modern Occasions",
    excerpt: "The timeless Anarkali gets a contemporary twist — here's how to wear it beyond traditional events.",
    cover_image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=400&fit=crop",
    category: "Fashion",
    tags: ["ethnic", "styling", "anarkali"],
    published_at: "2025-01-08",
  },
  {
    id: "3",
    title: "My 10-Step Skincare Routine for Glass Skin",
    excerpt: "The skincare secrets behind flawless makeup application — a routine that changed everything for me.",
    cover_image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=400&fit=crop",
    category: "Skincare",
    tags: ["skincare", "glasskin", "routine"],
    published_at: "2024-12-28",
  },
  {
    id: "4",
    title: "Packing Light for a Weekend Getaway — Fashion Edition",
    excerpt: "The art of packing a capsule wardrobe that takes you from day to night, beach to brunch.",
    cover_image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
    category: "Travel",
    tags: ["travel", "packing", "capsule wardrobe"],
    published_at: "2024-12-20",
  },
  {
    id: "5",
    title: "The Best Drugstore Makeup Products Under ₹500",
    excerpt: "Gorgeous looks don't require a huge budget. These hidden gems deliver serious results.",
    cover_image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
    category: "Makeup",
    tags: ["budget", "drugstore", "tips"],
    published_at: "2024-12-10",
  },
  {
    id: "6",
    title: "Building a Mindful Morning Ritual",
    excerpt: "How I start my day with intention — a routine that feeds both creativity and calm.",
    cover_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    category: "Lifestyle",
    tags: ["wellness", "morning routine", "mindfulness"],
    published_at: "2024-12-01",
  },
];

const categoryColors: Record<string, string> = {
  Makeup: "bg-pink-100 text-pink-700",
  Fashion: "bg-purple-100 text-purple-700",
  Skincare: "bg-green-100 text-green-700",
  Lifestyle: "bg-amber-100 text-amber-700",
  Travel: "bg-sky-100 text-sky-700",
};

export default function LifestylePage() {
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

        {/* Featured post */}
        <Link href={`/lifestyle/${featured.id}`} className="block mb-10">
          <Card className="overflow-hidden group border-0 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="grid lg:grid-cols-2">
              <div className="relative h-72 lg:h-auto">
                <Image
                  src={featured.cover_image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="flex flex-col justify-center p-8 lg:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[featured.category] ?? "bg-gray-100 text-gray-600"}`}>
                    {featured.category}
                  </span>
                  <Badge className="bg-brand-50 text-brand-600 border-brand-200 hover:bg-brand-50">
                    Featured
                  </Badge>
                </div>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-brand-600 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featured.published_at)}
                  </div>
                  <span className="text-brand-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read more <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>

        {/* Post grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link key={post.id} href={`/lifestyle/${post.id}`}>
              <Card className="overflow-hidden group border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(post.published_at)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
