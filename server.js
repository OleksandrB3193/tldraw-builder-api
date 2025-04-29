require("dotenv").config();
const { cleanSvgContent } = require("./utils/clean-svg");
const express = require("express");
const OAuth = require("oauth").OAuth;
const cors = require("cors");
const app = express();
app.use(cors());

const PORT = process.env.PORT || 5555;

const KEY = process.env.REACT_NOUN_PROJECT_API_KEY;
const SECRET = process.env.REACT_NOUN_PROJECT_API_SECRET;

const oauth = new OAuth(
  "https://api.thenounproject.com",
  "https://api.thenounproject.com",
  KEY,
  SECRET,
  "1.0",
  null,
  "HMAC-SHA1"
);

app.get("/api/icons", (req, res) => {
  const { query, next_page } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const searchUrl = next_page
    ? `https://api.thenounproject.com/v2/icon?query=${query}&next_page=${next_page}&limit=5&limit_to_public_domain=1`
    : `https://api.thenounproject.com/v2/icon?query=${query}&limit=5&limit_to_public_domain=1`;

  oauth.get(searchUrl, "", "", (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to fetch data" });
    }

    const parsedResult = JSON.parse(result);

    if (!parsedResult.icons || parsedResult.icons.length === 0) {
      return res.status(404).json({ error: "No icons found" });
    }

    const next_page_token = parsedResult.next_page || null;
    const icons = parsedResult.icons;

    res.json({ icons, next_page: next_page_token });
  });
});

app.get("/api/icons/:id", (req, res) => {
  const { id } = req.params;
  const downloadUrl = `https://api.thenounproject.com/v2/icon/${id}/download?color=A3A3A3&filetype=svg`;

  oauth.get(downloadUrl, "", "", (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to fetch data" });
    }

    const downloadResult = JSON.parse(result);

    const svg = atob(downloadResult.base64_encoded_file);
    res.json({ svg: cleanSvgContent(svg) });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
