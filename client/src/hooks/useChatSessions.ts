import { useMemo, useState } from "react";
import { api } from "../utils/api";
import type { ChatSession, Message, Role } from "../utils/types";

const createMessage = (role: Role, content: string): Message => ({
  id: crypto.randomUUID(),
  role,
  content,
  createdAt: Date.now(),
});

const createSession = (): ChatSession => ({
  id: crypto.randomUUID(),
  title: "New Chat",
  messages: [],
  documentText: "",
  documentName: "",
  documentFile: null,
  imageFile: null,
  imagePreview: "",
});

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([createSession()]);
  const [activeId, setActiveId] = useState(sessions[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeId) ?? sessions[0],
    [sessions, activeId],
  );

  const updateActive = (updater: (session: ChatSession) => ChatSession) => {
    setSessions((prev) =>
      prev.map((session) => (session.id === activeId ? updater(session) : session)),
    );
  };

  const newChat = () => {
    const next = createSession();
    setSessions((prev) => [next, ...prev]);
    setActiveId(next.id);
    setError(null);
  };

  const selectChat = (id: string) => {
    setActiveId(id);
    setError(null);
  };

  const resetUploads = () => {
    updateActive((session) => ({
      ...session,
      documentText: "",
      documentName: "",
      documentFile: null,
      imageFile: null,
      imagePreview: "",
    }));
  };

  const setDocument = (file: File | null, text = "") => {
    updateActive((session) => ({
      ...session,
      documentFile: file,
      documentName: file?.name ?? "",
      documentText: text,
    }));
  };

  const setImage = (file: File | null, preview = "") => {
    updateActive((session) => ({
      ...session,
      imageFile: file,
      imagePreview: preview,
    }));
  };

  const appendMessage = (role: Role, content: string) => {
    updateActive((session) => {
      const nextMessages = [...session.messages, createMessage(role, content)];
      const nextTitle =
        session.title === "New Chat" && role === "user"
          ? content.slice(0, 40) || "New Chat"
          : session.title;
      return {
        ...session,
        title: nextTitle,
        messages: nextMessages,
      };
    });
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() && !activeSession.documentFile && !activeSession.imageFile) {
      setError("Please enter a message or attach a file.");
      return;
    }

    setError(null);
    setLoading(true);
    if (content.trim()) {
      appendMessage("user", content.trim());
    }

    const history = activeSession.messages.slice(-10).map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const formData = new FormData();
    formData.append("message", content.trim());
    formData.append("chatHistory", JSON.stringify(history));

    if (activeSession.documentText) {
      formData.append("documentText", activeSession.documentText);
    }

    if (activeSession.documentFile && !activeSession.documentText) {
      formData.append("document", activeSession.documentFile);
    }

    if (activeSession.imageFile) {
      formData.append("image", activeSession.imageFile);
    }

    try {
      const response = await api.post("/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      appendMessage("assistant", response.data?.message ?? "No response");
    } catch (err: any) {
      const message =
        err?.response?.data?.error ?? "Something went wrong. Please try again.";
      appendMessage("assistant", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const setErrorMessage = (message: string | null) => {
    setError(message);
  };

  return {
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
  };
};
