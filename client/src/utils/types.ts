export type Role = "user" | "assistant";

export type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  documentText?: string;
  documentName?: string;
  documentFile?: File | null;
  imageFile?: File | null;
  imagePreview?: string;
};
