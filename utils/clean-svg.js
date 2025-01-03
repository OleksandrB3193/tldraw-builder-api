const cleanSvgContent = (svgContent) => {
  return svgContent
    .replace(/<\?xml.*?\?>\n/g, "")
    .replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, "")
    .replace(/xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/g, "")
    .replace(/xml:space="preserve"/g, "")
    .trim();
};

module.exports = { cleanSvgContent };
