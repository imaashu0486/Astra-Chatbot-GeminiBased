import type { ChatSession } from "../utils/types";

type SidebarProps = {
  sessions: ChatSession[];
  activeId: string;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

export const Sidebar = ({
  sessions,
  activeId,
  onNewChat,
  onSelectChat,
  darkMode,
  onToggleDarkMode,
}: SidebarProps) => {
  return (
    <aside className="flex h-full w-72 flex-col gap-6 border-r border-slate-200/60 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Gemini</p>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            Astra Chat
          </h1>
        </div>
        <button
          onClick={onToggleDarkMode}
          className="rounded-full border border-slate-200/60 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
        >
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>

      <button
        onClick={onNewChat}
        className="rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
      >
        + New Chat
      </button>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Recent
        </p>
        <div className="flex flex-col gap-2">
          {sessions.slice(0, 8).map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectChat(session.id)}
              className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                session.id === activeId
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
              }`}
            >
              <p className="line-clamp-1 font-medium">{session.title}</p>
              <p className="text-xs text-slate-400">
                {session.messages.length} messages
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto rounded-2xl border border-dashed border-slate-200/70 bg-white/60 p-4 text-xs text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
        Gemini 1.5 Flash • Secure session memory • Upload PDFs, TXT, or images.
      </div>
    </aside>
  );
};
