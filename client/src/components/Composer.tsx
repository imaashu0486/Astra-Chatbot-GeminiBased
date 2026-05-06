import { useEffect, useRef } from "react";
import { formatBytes } from "../utils/format";

type ComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  error?: string | null;
  documentName?: string;
  documentSize?: number;
  imagePreview?: string;
  onDocumentSelect: (file: File | null) => void;
  onImageSelect: (file: File | null) => void;
  onClearUploads: () => void;
};

export const Composer = ({
  value,
  onChange,
  onSend,
  disabled,
  error,
  documentName,
  documentSize,
  imagePreview,
  onDocumentSelect,
  onImageSelect,
  onClearUploads,
}: ComposerProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-slate-200/60 bg-white/80 px-6 py-4 dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-xl border border-slate-200/60 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
          Upload doc
          <input
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(event) => onDocumentSelect(event.target.files?.[0] ?? null)}
          />
        </label>
        <label className="cursor-pointer rounded-xl border border-slate-200/60 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
          Upload image
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(event) => onImageSelect(event.target.files?.[0] ?? null)}
          />
        </label>
        {(documentName || imagePreview) && (
          <button
            onClick={onClearUploads}
            className="text-xs font-semibold text-rose-500"
          >
            Clear uploads
          </button>
        )}
      </div>

      {(documentName || imagePreview) && (
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {documentName ? (
            <div className="rounded-xl border border-slate-200/60 bg-white px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
              {documentName}
              {documentSize ? ` • ${formatBytes(documentSize)}` : ""}
            </div>
          ) : null}
          {imagePreview ? (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white px-2 py-2 dark:border-white/10 dark:bg-white/10">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="h-14 w-14 rounded-lg object-cover"
              />
              <span className="text-xs text-slate-600 dark:text-slate-200">
                Image attached
              </span>
            </div>
          ) : null}
        </div>
      )}

      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Gemini anything..."
          rows={1}
          className="max-h-40 flex-1 resize-none rounded-2xl border border-slate-200/60 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:focus:border-indigo-400"
        />
        <button
          onClick={onSend}
          disabled={disabled}
          className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send
        </button>
      </div>

      {error ? <p className="mt-2 text-xs text-rose-500">{error}</p> : null}
      <p className="mt-2 text-[11px] text-slate-400">
        Press Enter to send. Shift + Enter for a new line.
      </p>
    </div>
  );
};
