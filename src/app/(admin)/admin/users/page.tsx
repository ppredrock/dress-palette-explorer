import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, Mail, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Users" };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Members</h1>
        <p className="text-gray-400 text-sm mt-1">{users?.length ?? 0} registered members</p>
      </div>

      {users && users.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {users.map((u) => (
            <Card key={u.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg font-semibold text-gray-300 shrink-0">
                    {u.full_name ? u.full_name[0].toUpperCase() : u.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-white truncate">
                        {u.full_name ?? "No name"}
                      </p>
                      {u.role === "admin" && (
                        <Badge variant="default" className="text-xs bg-brand-500">Admin</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      Joined {formatDate(u.created_at)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-16">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No users yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
