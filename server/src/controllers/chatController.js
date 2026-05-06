const pdfParse = require("pdf-parse");
const { generateGeminiResponse } = require("../services/geminiService");

const extractDocumentText = async (documentFile) => {
  if (!documentFile) return "";

  if (documentFile.mimetype === "application/pdf") {
    const parsed = await pdfParse(documentFile.buffer);
    return parsed.text || "";
  }

  if (documentFile.mimetype === "text/plain") {
    return documentFile.buffer.toString("utf-8");
  }

  return "";
};

const chatHandler = async (req, res) => {
  try {
    const message = req.body.message?.trim();
    let chatHistory = [];
    if (req.body.chatHistory) {
      try {
        const parsed = JSON.parse(req.body.chatHistory);
        if (Array.isArray(parsed)) {
          chatHistory = parsed
            .filter((entry) => entry && typeof entry.content === "string")
            .map((entry) => ({
              role: entry.role === "assistant" ? "assistant" : "user",
              content: entry.content,
            }));
        }
      } catch (parseError) {
        return res.status(400).json({ error: "Invalid chat history payload." });
      }
    }
    const documentTextBody = req.body.documentText || "";
    const documentFile = req.files?.document?.[0];
    const imageFile = req.files?.image?.[0];

    if (!message && !documentFile && !imageFile) {
      return res.status(400).json({ error: "Message or file is required." });
    }

    const documentTextFile = documentTextBody
      ? ""
      : await extractDocumentText(documentFile);
    const documentText = `${documentTextBody}\n${documentTextFile}`.trim();

    const responseText = await generateGeminiResponse({
      message: message || "",
      chatHistory,
      documentText,
      image: imageFile,
    });

    return res.json({ message: responseText });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Failed to generate response.",
    });
  }
};

module.exports = { chatHandler };
