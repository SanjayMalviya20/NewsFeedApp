// src/components/NewsFeed.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews, addNews ,setCategorys} from "../redux/newSlice";
import io from "socket.io-client";
import axios from "axios";
import {  ThumbsDownIcon, ThumbsUpIcon } from "hugeicons-react"

// Connect to the backend Socket.io server
const socket = io("http://localhost:4444");

const NewsFeed = () => {
  const dispatch = useDispatch();
  const { newsList, status,categorys } = useSelector((state) => state.news);
  // console.log(categorys)
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [action ,setAction] =useState("")
 console.log(action)
  // Fetch initial news on component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNews());
    }

    // Listen for "news_update" events from the backend
    socket.on("news_update", (newNews) => {
      console.log("Received news_update:", newNews);
      dispatch(addNews(newNews));
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("news_update");
    };
  }, [dispatch, status]);

  // Function to post new news to the backend
  const handlePostNews = async () => {
    const newsData = { title, category, content };
    try {
      await axios.post("http://localhost:4444/api/news", newsData);
      dispatch(fetchNews());
      setTitle("");
      setCategory("");
      setContent("");
    } catch (error) {
      console.error("Error posting news:", error);
    }
  };

  //Function to like news
  const handleLikeNews = async (newsId) => {
    try {
      const response = await axios.post(`http://localhost:4444/api/news/${newsId}/feedback`,{action});
      // console.log(response.data);
      dispatch(fetchNews());
    } catch (error) {
      console.error("Error liking news:", error);
    }
  };

  // console.log(SelcetCategory)
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Real-Time News Feed</h2>
      <div style={styles.formContainer}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          style={styles.textarea}
        ></textarea>
        <button onClick={handlePostNews} style={styles.button}>
          Post News
        </button>
      </div>
      <hr style={styles.divider} />
      <h3 style={styles.subHeading}>See All Latest News</h3>
      <div style={{display:"flex",gap:"10px",alignItems:"center"}}>

      <h3 style={{color:"#000",fontSize:"16px"}}>Select Category</h3>
      <select onChange={(e) => dispatch(setCategorys(e.target.value))} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" ,outline: "none",marginRight:"10px",cursor:"pointer",marginBottom:"10px"}}  >
        <option disabled selected> Select Category</option>
        <option defaultValue={"All"}>All</option>
        <option defaultValue={"Tech"}>Tech</option>
        <option defaultValue={"Sport"}>Sport</option>
        <option defaultValue={"Health"}>Health</option>
        <option defaultValue={"Politics"}>Politics</option>
        <option defaultValue={"Business"}> Business</option>
      </select>
      </div>
      <div style={styles.newsList}>
        {newsList?.filter((news) => categorys === "All" || news.category === categorys).map((news) => (
          <div key={news._id} style={styles.newsCard}>
            <h4 style={styles.newsTitle}>title:{news.title}</h4>
            <p style={styles.newsCategory}>
              <strong>Category:</strong> {news.category}
            </p>
            <p style={styles.newsContent}>{news.content}</p>
            <div style={{display:"flex",gap:"10px"}}>

            <div  style={styles.likeContainer}>
              <ThumbsUpIcon onClick={() => {handleLikeNews(news._id), setAction("like")}} style={{ color: "#000", width: "20px", cursor: "pointer" }} />
              <span style={styles.likeCount}>{news.likes}</span>
            </div>
            <div  style={styles.likeContainer}>
              <ThumbsDownIcon onClick={() => {handleLikeNews(news._id), setAction("dislike")}}  style={{ color: "#000", width: "20px", cursor: "pointer" }} />
              <span style={styles.likeCount}>{news?.dislikes}</span>
            </div>
          </div>
            </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "auto",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff",
    borderRadius: "8px",
    // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "12px",
    boxShadow:" 0px 0px 10px black",
    outline: "none",
    fontSize: "16px",
    backgroundColor: "#fff",
    // border: "1px solid #ccc",
    borderRadius: "4px",
    color: "#333",
  },
  textarea: {
    padding: "12px",
    fontSize: "16px",
    outline: "none",
    color: "#333",
    backgroundColor: "#fff",
    // border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow:" 0px 0px 10px black",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "rgb(6 49 97)",
    color: "#fff",
    outline: "none",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  divider: {
    margin: "20px 0",
    border: "none",
    borderTop: "1px solid #eee",
  },
  subHeading: {
    color: "#555",
    marginBottom: "15px",
  },
  newsList: {
    display: "flex",
    width: "auto",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    // flexDirection: "column",
    gap: "15px",
  },
  newsCard: {
    padding: "15px",
    // display:"flex",
    // height: "149px",
    width: "288px",
    border: "1px solid #eee",
    borderRadius: "6px",
    boxShadow:" 0px 0px 10px black",
    backgroundColor: "rgb(211 214 234)",
  },
  newsTitle: {
    margin: "0 0 10px",
    color: "#333",
  },
  newsCategory: {
    margin: "0 0 10px",
    color: "#333",
  },
  newsContent: {
    margin: 0,
    fontWeight: "bold",
    fontSize: "18px",
    // fontFamily: "",
    color: "#333",
  },
  likeContainer: {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },
  heartButton: {
    background: "none",
    border: "none",
    textDecoration: "none",
    outline: "none",
    fontSize: "19px",
    // color: "#e74c3c",
    cursor: "pointer",
  },
  likeCount: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
};

export default NewsFeed;
