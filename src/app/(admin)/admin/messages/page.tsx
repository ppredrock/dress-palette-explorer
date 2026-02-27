"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Message, Profile } from "@/types/database";

type MessageWithUser = Message & { user: Profile | null };

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*, user:profiles(full_name, email, avatar_url)")
      .order("created_at", { ascending: false });
    setMessages((data as MessageWithUser[]) ?? []);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMarkRead = async (id: string) => {
    await supabase.from("messages").update({ read: true }).eq("id", id);
    load();
  };

  const handleReply = async (id: string) => {
    if (!replyText[id]?.trim()) return;
    setSending(id);
    await supabase.from("messages").update({
      admin_reply: replyText[id],
      read: true,
      replied_at: new Date().toISOString(),
    }).eq("id", id);
    setReplyText((prev) => ({ ...prev, [id]: "" }));
    setSending(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Messages</h1>
        <p className="text-gray-400 text-sm">
          {messages.filter((m) => !m.read).length} unread message(s)
        </p>
      </div>

      {messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card key={msg.id} className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <button
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => {
                    setExpanded(expanded === msg.id ? null : msg.id);
                    if (!msg.read) handleMarkRead(msg.id);
                  }}
                >
                  <div className="flex items-center gap-3">
                    {!msg.read && (
                      <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                    )}
                    <div className="w-8 h-8 rounded-lg bg-purple-900 flex items-center justify-center">
                      <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{msg.subject}</p>
                      <p className="text-xs text-gray-400">
                        {msg.user?.full_name ?? msg.user?.email ?? "User"} · {formatDate(msg.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {msg.admin_reply && (
                      <Badge variant="success" className="text-xs">Replied</Badge>
                    )}
                    {!msg.read && (
                      <Badge variant="warning" className="text-xs">New</Badge>
                    )}
                    {expanded === msg.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {expanded === msg.id && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-gray-800 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1 font-medium">Message from {msg.user?.full_name ?? "user"}</p>
                      <p className="text-sm text-gray-200">{msg.content}</p>
                    </div>

                    {msg.admin_reply && (
                      <div className="bg-brand-900/30 rounded-xl p-3 border-l-4 border-brand-500">
                        <p className="text-xs text-brand-400 mb-1 font-medium">Your reply</p>
                        <p className="text-sm text-gray-200">{msg.admin_reply}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyText[msg.id] ?? ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({ ...prev, [msg.id]: e.target.value }))
                        }
                        rows={3}
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-brand-500"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() => handleReply(msg.id)}
                          disabled={sending === msg.id || !replyText[msg.id]?.trim()}
                        >
                          {sending === msg.id ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Send className="w-3 h-3" />
                          )}
                          {msg.admin_reply ? "Update Reply" : "Send Reply"}
                        </Button>
                        {!msg.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-2 text-gray-400 hover:text-white"
                            onClick={() => handleMarkRead(msg.id)}
                          >
                            <Check className="w-3 h-3" />
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-16">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No messages yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
