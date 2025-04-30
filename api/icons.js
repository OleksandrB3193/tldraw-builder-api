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
      const { query, next_page } = req.query;

      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const limit = 30; // Set the limit to 5 icons per request

      const searchUrl = next_page
        ? `https://api.thenounproject.com/v2/icon?query=${query}&next_page=${next_page}&limit=${limit}&limit_to_public_domain=1`
        : `https://api.thenounproject.com/v2/icon?query=${query}&limit=${limit}&limit_to_public_domain=1`;

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
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

module.exports = handler;
