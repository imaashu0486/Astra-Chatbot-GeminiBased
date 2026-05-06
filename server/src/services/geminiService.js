const { GoogleGenerativeAI } = require("@google/generative-ai");

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenerativeAI(apiKey);
};

const trimDocumentText = (documentText) => {
  if (!documentText) return "";
  const limit = Number(process.env.DOCUMENT_TEXT_LIMIT || 12000);
  if (!Number.isFinite(limit) || limit <= 0) return documentText;
  return documentText.length > limit
    ? `${documentText.slice(0, limit)}\n\n[Document truncated]`
    : documentText;
};

const buildPrompt = ({ message, chatHistory, documentText, hasImage }) => {
  const historyText = chatHistory
    .map((entry) => `${entry.role === "user" ? "User" : "Assistant"}: ${entry.content}`)
    .join("\n");

  const docSection = documentText
    ? `\n\nDocument Context:\n${documentText}`
    : "";

  const hasDocument = Boolean(documentText);
  const normalizedMessage = message.toLowerCase();
  const visualKeywords = ["image", "diagram", "figure", "chart", "graph", "visual", "picture", "photo", "screenshot", "table"];
  const docKeywords = ["summary", "summarize", "explain", "theory", "paper", "document", "method", "algorithm", "conclusion", "abstract", "results"];
  const asksVisual = visualKeywords.some((keyword) => normalizedMessage.includes(keyword));
  const asksDoc = docKeywords.some((keyword) => normalizedMessage.includes(keyword));

  let contextInstruction = "Answer normally.";
  if (hasImage && !hasDocument) {
    contextInstruction = "Answer ONLY using the uploaded image.";
  } else if (hasDocument && !hasImage) {
    contextInstruction = "Answer ONLY using the uploaded document.";
  } else if (hasDocument && hasImage) {
    contextInstruction = `You have BOTH a document and an image.

- If the question is about diagram, figure, or visual → use IMAGE
- If the question is about explanation, summary, or theory → use DOCUMENT
- If needed, combine both carefully
- Do NOT hallucinate`;

    if (asksVisual && !asksDoc) {
      contextInstruction += "\n\nThe user intent is visual. Use IMAGE only.";
    } else if (asksDoc && !asksVisual) {
      contextInstruction += "\n\nThe user intent is document-based. Use DOCUMENT only.";
    }
  }

  const missingContextNotice = !hasDocument && !hasImage
    ? "\n\nIf the user asks about uploaded files or images and none were provided, respond exactly: No files have been uploaded yet."
    : "";

  const fallbackInstruction = "If the provided content does not contain the answer, respond exactly: The provided content does not contain this information.";

  return `You are a precise assistant. Keep answers concise and grounded in provided context.\n\n${contextInstruction}\n${fallbackInstruction}${missingContextNotice}\n\nConversation:\n${historyText}\n\nUSER QUESTION:\n${message}${docSection}`;
};

const generateGeminiResponse = async ({
  message,
  chatHistory,
  documentText,
  image,
}) => {
  const client = getGeminiClient();
  const primaryModel = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || "gemini-pro-latest";
  const trimmedDocument = trimDocumentText(documentText);

  const prompt = buildPrompt({
    message,
    chatHistory,
    documentText: trimmedDocument,
    hasImage: Boolean(image),
  });

  const parts = [{ text: prompt }];

  if (image) {
    parts.push({
      inlineData: {
        data: image.buffer.toString("base64"),
        mimeType: image.mimetype,
      },
    });
  }

  const runModel = async (modelName) => {
    const model = client.getGenerativeModel({ model: modelName });
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });
    return result.response.text();
  };

  try {
    return await runModel(primaryModel);
  } catch (error) {
    const messageText = String(error?.message || "").toLowerCase();
    const isModelError = messageText.includes("not found") || messageText.includes("model");

    if (fallbackModel && fallbackModel !== primaryModel && isModelError) {
      try {
        return await runModel(fallbackModel);
      } catch (fallbackError) {
        throw new Error(
          fallbackError?.message || "Gemini failed to respond using fallback model.",
        );
      }
    }

    throw new Error(error?.message || "Gemini failed to respond.");
  }
};

module.exports = { generateGeminiResponse };
