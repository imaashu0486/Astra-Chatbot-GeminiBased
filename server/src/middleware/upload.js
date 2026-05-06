const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedDocs = ["application/pdf", "text/plain"];
  const allowedImages = ["image/png", "image/jpeg"];
  const name = file.originalname?.toLowerCase() || "";
  const isPdf = name.endsWith(".pdf");
  const isTxt = name.endsWith(".txt");
  const isPng = name.endsWith(".png");
  const isJpg = name.endsWith(".jpg") || name.endsWith(".jpeg");

  if (file.fieldname === "document") {
    if (allowedDocs.includes(file.mimetype) || isPdf || isTxt) {
      return cb(null, true);
    }
  }

  if (file.fieldname === "image") {
    if (allowedImages.includes(file.mimetype) || isPng || isJpg) {
      return cb(null, true);
    }
  }

  return cb(new Error("Unsupported file type"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

module.exports = { upload };
