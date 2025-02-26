// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import dotenv from "dotenv";
// Import News model
import News from "./models/News.js";
import dbConnect from "./config/dbConnect.js";
import { Getallnews, NewsPost } from "./controllers/NewFeedController.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// app.use(express.static(path.join(_dirname, "../client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(_dirname, "../client/dist/index.html"));
// });
app.get("/hello", (req, res) => {
  res.send("Hello, World!");
}
);

app.get("/apidata", async(req, res) => {
  const data =await News.find().sort({ createdAt: -1 });
  res.json(data);
  })

// Socket.io connection and event listeners
io.on("connection", (socket) => {
  // console.log("Client connected:", socket.id);

  // Listen for "new_news" events from clients (if you choose to emit separately)
  socket.on("new_news", (newsData) => {

    console.log("Received new_news:", newsData,socket.id);
    // Broadcast the news update to all connected clients
    io.emit("news_update", newsData);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// API endpoint to post news
app.post("/api/news",NewsPost);

// API endpoint to get all news
app.get("/api/news",Getallnews);
//like news api

// Endpoint to update feedback (like/dislike) on a news item
app.post("/api/news/:id/feedback", async (req, res) => {
  const { action } = req.body; // Expecting { action: "like" } or { action: "dislike" }

  // Validate the action
  if (!action || (action !== "like" && action !== "dislike")) {
    return res.status(400).json({ error: "Invalid action. Use 'like' or 'dislike'." });
  }
// console.log(action)
  try {
    // Determine the update based on the action
    let update = action === "like" ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };

    // Update the news item in the database and return the updated document
    const newsItem = await News.findByIdAndUpdate(req.params.id, update, { new: true });
    
    // Optionally, emit an update to all connected clients using socket.io
    io.emit("news_update", newsItem);

    res.json(newsItem?.likes);
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ error: "Error updating feedback" });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    dbConnect();
  console.log(`Server is running on port ${PORT}`);
});

