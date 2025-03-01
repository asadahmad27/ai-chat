const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3333;

const corsOptions = {
  origin: ["http://localhost:5173", "https://ai-chat-psi-flax.vercel.app"], // Add your frontend URLs here
  methods: "GET,POST,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

let chatHistory = []; // This will hold the chat history in memory for simplicity
let assistants = [
  { id: 1, name: "Assistant 1" },
  { id: 2, name: "Assistant 2" },
  { id: 3, name: "Assistant 3" },
  { id: 4, name: "Assistant 4" },
];

// POST /api/chat
app.post("/api/chat", (req, res) => {
  const userMessage = req.body.message;
  const aiResponse = `Mocked response to: ${userMessage}`; // Mocked response
  chatHistory.push({ user: userMessage, ai: aiResponse });
  res.json({ response: aiResponse });
});

// POST /api/chat-with-image
app.post("/api/chat-with-image", upload.single("image"), (req, res) => {
  const { message } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  res.json({
    response: `AI Response: ${message}`,
    imageUrl,
  });
});

// GET /api/history
app.get("/api/history", (req, res) => {
  res.json(chatHistory);
});

// GET /api/assistants
app.get("/api/assistants", (req, res) => {
  res.json(assistants);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
