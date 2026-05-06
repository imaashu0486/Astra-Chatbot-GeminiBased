import { useMemo, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { MessageList } from "../components/MessageList";
import { Composer } from "../components/Composer";
import { useChatSessions } from "../hooks/useChatSessions";

export const ChatPage = () => {
  const {
    sessions,
    activeSession,
    loading,
    error,
    newChat,
    selectChat,
    resetUploads,
    setDocument,
    setImage,
    sendMessage,
    setErrorMessage,
  } = useChatSessions();

  const [draft, setDraft] = useState("");
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const messages = useMemo(() => activeSession.messages, [activeSession]);

  const handleNewChat = () => {
    newChat();
    setDraft("");
  };

  const handleSend = () => {
    if (!draft.trim() && !activeSession.documentFile && !activeSession.imageFile) {
      sendMessage("");
      return;
    }
    sendMessage(draft);
    setDraft("");
  };

  const handleDocumentSelect = (file: File | null) => {
    if (!file) {
      setDocument(null, "");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Document too large. Max 8MB.");
      setDocument(null, "");
      return;
    }

    const isSupported =
      file.type === "application/pdf" || file.type === "text/plain";

    if (!isSupported) {
      setErrorMessage("Unsupported document type. Use PDF or TXT.");
      setDocument(null, "");
      return;
    }

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = () => {
        setDocument(file, String(reader.result ?? ""));
        setErrorMessage(null);
      };
      reader.readAsText(file);
    } else {
      setDocument(file, "");
      setErrorMessage(null);
    }
  };

  const handleImageSelect = (file: File | null) => {
    if (!file) {
      setImage(null, "");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Image too large. Max 8MB.");
      setImage(null, "");
      return;
    }

    const isSupported =
      file.type === "image/png" || file.type === "image/jpeg";
    if (!isSupported) {
      setErrorMessage("Unsupported image type. Use PNG or JPG.");
      setImage(null, "");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(file, String(reader.result ?? ""));
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0b0f14]">
      <Sidebar
        sessions={sessions}
        activeId={activeSession.id}
        onNewChat={handleNewChat}
        onSelectChat={selectChat}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      <main className="flex h-full flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200/60 px-6 py-4 dark:border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Active Session
            </p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {activeSession.title}
            </h2>
          </div>
          <div className="text-xs text-slate-400">
            {activeSession.messages.length} messages
          </div>
        </header>

        <section className="flex-1 overflow-hidden">
          <MessageList messages={messages} loading={loading} onCopy={handleCopy} />
        </section>

        <Composer
          value={draft}
          onChange={setDraft}
          onSend={handleSend}
          disabled={loading}
          error={error}
          documentName={activeSession.documentName}
          documentSize={activeSession.documentFile?.size}
          imagePreview={activeSession.imagePreview}
          onDocumentSelect={handleDocumentSelect}
          onImageSelect={handleImageSelect}
          onClearUploads={resetUploads}
        />
      </main>
    </div>
  );
};
