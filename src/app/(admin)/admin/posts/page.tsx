import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { FileText, Plus, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { lifestyle_posts } from "@/db/schema";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Blog Posts" };
export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const posts = await db
    .select()
    .from(lifestyle_posts)
    .orderBy(desc(lifestyle_posts.created_at));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-400 text-sm mt-1">{posts.length} posts</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{post.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                    <span className="capitalize">{post.category}</span>
                    {post.published_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.published_at)}
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant={post.published ? "success" : "secondary"} className="text-xs shrink-0">
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-16">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">No posts yet</p>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Write First Post
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
