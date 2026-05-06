const express = require("express");
const { chatHandler } = require("../controllers/chatController");
const { upload } = require("../middleware/upload");

const router = express.Router();

router.post(
  "/chat",
  upload.fields([
    { name: "document", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  chatHandler,
);

module.exports = router;
