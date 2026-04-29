"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = [
  "fashion",
  "makeup",
  "skincare",
  "lifestyle",
  "travel",
  "food",
  "other",
] as const;

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("other");
  const [published, setPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSubmitting(true);
    setError(null);

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim() || undefined,
        content: content || undefined,
        cover_image: coverImage.trim() || undefined,
        tags,
        category,
        published,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Failed to create post");
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/posts">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">New Post</h1>
          <p className="text-gray-400 text-sm mt-1">Create a new lifestyle post</p>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-200">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-gray-200">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated from title if blank"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-gray-200">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary"
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image" className="text-gray-200">Cover Image URL</Label>
              <Input
                id="cover_image"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-200">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as (typeof CATEGORIES)[number])
                  }
                  className="flex h-10 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-gray-800 capitalize">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-gray-200">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="fashion, trends, 2025"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-200">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post in markdown or plain text..."
                rows={12}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 font-mono text-xs"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-200">Publish immediately</span>
            </label>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Create Post
              </Button>
              <Link href="/admin/posts">
                <Button type="button" variant="ghost" className="text-gray-400 hover:text-white">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
