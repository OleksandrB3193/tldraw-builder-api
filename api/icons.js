const OAuth = require("oauth").OAuth;
const cors = require("cors");

const KEY = process.env.REACT_NOUN_PROJECT_API_KEY;
const SECRET = process.env.REACT_NOUN_PROJECT_API_SECRET;

if (!KEY || !SECRET) {
  console.error("API key and secret must be set in environment variables");
  process.exit(1);
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

const handler = async (req, res) => {
  cors()(req, res, async () => {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const searchUrl = `https://api.thenounproject.com/v2/icon?query=${query}&limit=10&limit_to_public_domain=1`;

      oauth.get(searchUrl, "", "", (err, result) => {
        if (err) {
          console.error("Error fetching data:", err);
          return res.status(500).json({ error: "Failed to fetch data" });
        }

        const icons = JSON.parse(result).icons;
        res.json(icons);
      });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

module.exports = handler;
