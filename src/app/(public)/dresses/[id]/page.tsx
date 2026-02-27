import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Star, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dress Details",
};

// In production this would fetch from Supabase
const getDress = (id: string) => ({
  id,
  title: "Blush Rose Bridal Gown",
  description: "An ethereal bridal gown in the most romantic shade of blush rose. Features delicate floral lace appliqué, a sweetheart neckline, and a flowing A-line silhouette that flatters every figure. The gown is lined with premium silk and has a corset back for the perfect fit.",
  category: "Bridal",
  rental_price: 2500,
  price: 45000,
  images: [
    "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=750&fit=crop",
  ],
  sizes: ["XS", "S", "M", "L"],
  colors: ["Blush Rose", "Ivory", "Champagne"],
  available: true,
  featured: true,
});

export default async function DressDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dress = getDress(id);

  return (
    <div className="pt-20 pb-16 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dresses" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-600 mt-6 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative h-[500px] rounded-3xl overflow-hidden">
              <Image
                src={dress.images[0]}
                alt={dress.title}
                fill
                className="object-cover"
              />
              {dress.featured && (
                <Badge className="absolute top-4 left-4 bg-brand-500 text-white border-0">
                  Featured
                </Badge>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-brand-50 transition-colors">
                  <Heart className="w-4 h-4 text-brand-500" />
                </button>
                <button className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            {dress.images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {dress.images.map((img, i) => (
                  <div key={i} className="relative h-28 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <Image src={img} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <Badge className="mb-3 bg-brand-50 text-brand-600 border-brand-200 hover:bg-brand-50">
              {dress.category}
            </Badge>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
              {dress.title}
            </h1>
            <div className="flex items-center gap-1 mb-6">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-sm text-gray-500 ml-1">(24 reviews)</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{dress.description}</p>

            {/* Pricing */}
            <div className="bg-brand-50 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Rental Price</span>
                <span className="font-display text-2xl font-bold text-brand-600">
                  {formatCurrency(dress.rental_price)}<span className="text-sm font-normal">/day</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Purchase Price</span>
                <span className="font-semibold text-gray-700">{formatCurrency(dress.price)}</span>
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">Available Sizes</p>
              <div className="flex gap-2 flex-wrap">
                {dress.sizes.map((size) => (
                  <button
                    key={size}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm hover:border-brand-400 hover:text-brand-600 transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-700 mb-2">Colors</p>
              <div className="flex gap-2 flex-wrap">
                {dress.colors.map((color) => (
                  <span key={color} className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                    {color}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link href="/register" className="block">
                <Button size="lg" className="w-full gap-2">
                  <Calendar className="w-5 h-5" />
                  Book for Rental
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full">
                Add to Wishlist
              </Button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              Sign in or create an account to book
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
