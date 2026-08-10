const toYoutubeEmbedUrl = (value) => {
  if (!value) return null;

  const input = String(value).trim();

  let url;

  try {
    url = new URL(input);
  } catch {
    throw new Error("Please provide a valid URL");
  }

  // Only allow HTTP/HTTPS URLs
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Please provide a valid HTTP or HTTPS URL");
  }

  return url.toString();
};

module.exports = { toYoutubeEmbedUrl };
