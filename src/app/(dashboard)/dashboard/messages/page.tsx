"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Message } from "@/types/database";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setMessages(data ?? []);
    };
    load();
  }, [supabase, sent]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("messages").insert({
      user_id: user.id,
      subject,
      content,
      read: false,
    });

    setSubject("");
    setContent("");
    setSending(false);
    setSent((v) => !v);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">Send a message to Neha and track her replies</p>
      </div>

      {/* Compose */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Send a Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="What's on your mind?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                placeholder="Write your message here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
              />
            </div>
            <Button type="submit" className="gap-2" disabled={sending}>
              {sending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Message history */}
      {messages.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">Previous Messages</h2>
          {messages.map((msg) => (
            <Card key={msg.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <button
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{msg.subject}</p>
                      <p className="text-xs text-gray-400">{formatDate(msg.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {msg.admin_reply && (
                      <Badge variant="success" className="text-xs">Replied</Badge>
                    )}
                    {expanded === msg.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {expanded === msg.id && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1 font-medium">Your message</p>
                      <p className="text-sm text-gray-700">{msg.content}</p>
                    </div>
                    {msg.admin_reply && (
                      <div className="bg-brand-50 rounded-xl p-3 border-l-4 border-brand-400">
                        <p className="text-xs text-brand-600 mb-1 font-medium">Neha replied</p>
                        <p className="text-sm text-gray-700">{msg.admin_reply}</p>
                        {msg.replied_at && (
                          <p className="text-xs text-gray-400 mt-1">{formatDate(msg.replied_at)}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
