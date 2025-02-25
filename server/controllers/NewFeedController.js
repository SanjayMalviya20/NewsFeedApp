import News from "../models/News.js";

export const NewsPost=async (req, res) => {
  try {
    const newsData = req.body;
    const newNews = new News(newsData);
    await newNews.save();

    // Emit news update to all clients

    // io.emit("news_update", newNews);

    res.status(201).json(newNews);
  } catch (error) {
    console.error("Error posting news:", error);
    res.status(500).json({ error: "Failed to post news" });
  }
}

export const Getallnews= async (req, res) => {
    try {
      const allNews = await News.find().sort({ createdAt: -1 });
      res.json(allNews);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  }