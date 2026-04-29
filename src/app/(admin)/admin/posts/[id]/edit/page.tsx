import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { lifestyle_posts } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import EditPostForm from "./EditPostForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Edit Post" };
export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  const { id } = await params;
  const rows = await db
    .select()
    .from(lifestyle_posts)
    .where(eq(lifestyle_posts.id, id))
    .limit(1);
  const post = rows[0];
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/posts">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Edit Post</h1>
          <p className="text-gray-400 text-sm mt-1">Update an existing lifestyle post</p>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <EditPostForm post={post} />
        </CardContent>
      </Card>
    </div>
  );
}
