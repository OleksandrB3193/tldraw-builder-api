require("dotenv").config();
const express = require("express");
const OAuth = require("oauth").OAuth;
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

const KEY = process.env.REACT_NOUN_PROJECT_API_KEY;
const SECRET = process.env.REACT_NOUN_PROJECT_API_SECRET;

console.log(KEY, SECRET);

app.get("/api/icons", (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const oauth = new OAuth(
    "https://api.thenounproject.com",
    "https://api.thenounproject.com",
    KEY,
    SECRET,
    "1.0",
    null,
    "HMAC-SHA1"
  );

  const url = `https://api.thenounproject.com/v2/icon?query=${query}&limit=30`;

  oauth.get(url, "", "", (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to fetch data" });
    }

    res.json(JSON.parse(result));
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
