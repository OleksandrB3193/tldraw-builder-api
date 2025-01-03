const OAuth = require("oauth").OAuth;
const { cleanSvgContent } = require("../../utils/clean-svg");
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
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const downloadUrl = `https://api.thenounproject.com/v2/icon/${id}/download?color=A3A3A3&filetype=svg`;

    oauth.get(downloadUrl, "", "", (err, result) => {
      if (err) {
        console.error("Error fetching data:", err);
        return res.status(500).json({ error: "Failed to fetch data" });
      }

      const downloadResult = JSON.parse(result);
      const svg = Buffer.from(
        downloadResult.base64_encoded_file,
        "base64"
      ).toString("utf8");
      res.json({ svg: cleanSvgContent(svg) });
    });
  });
};

module.exports = handler;
