import { useEffect, useRef } from "react";
import type { Message } from "../utils/types";
import { MessageBubble } from "./MessageBubble";

type MessageListProps = {
  messages: Message[];
  loading: boolean;
  onCopy: (content: string) => void;
};

export const MessageList = ({ messages, loading, onCopy }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-6 py-6 scrollbar-hidden">
      {messages.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center text-sm text-slate-500 dark:text-slate-300">
          Start a conversation. Upload a document or image to give Gemini more
          context.
        </div>
      ) : null}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} onCopy={onCopy} />
      ))}

      {loading ? (
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
          Gemini is thinking...
        </div>
      ) : null}

      <div ref={bottomRef} />
    </div>
  );
};
