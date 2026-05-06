import type { Message } from "../utils/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents = {
  code({ inline, className, children, ...props }: any) {
    const language = /language-(\w+)/.exec(className || "")?.[1];
    return inline ? (
      <code
        className="rounded bg-slate-900/80 px-1 py-0.5 text-xs text-white"
        {...props}
      >
        {children}
      </code>
    ) : (
      <pre className="overflow-x-auto rounded-xl bg-slate-950/90 p-4 text-xs text-slate-100">
        <code className={className} data-language={language} {...props}>
          {children}
        </code>
      </pre>
    );
  },
  a({ children, ...props }: any) {
    return (
      <a
        className="text-indigo-500 underline-offset-4 hover:underline"
        {...props}
      >
        {children}
      </a>
    );
  },
};

type MessageBubbleProps = {
  message: Message;
  onCopy?: (content: string) => void;
};

export const MessageBubble = ({ message, onCopy }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full items-start gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`message-card animate-fade-in max-w-[75%] ${
          isUser ? "message-user" : "message-assistant"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {!isUser && onCopy ? (
        <button
          onClick={() => onCopy(message.content)}
          className="rounded-full border border-slate-200/60 bg-white/90 px-2 py-1 text-xs text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
        >
          Copy
        </button>
      ) : null}
    </div>
  );
};
