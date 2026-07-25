const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

const toYoutubeEmbedUrl = (value) => {
  if (!value) return null;

  const input = String(value).trim();
  if (YOUTUBE_ID_PATTERN.test(input)) {
    return `https://www.youtube.com/embed/${input}`;
  }

  let url;
  try {
    url = new URL(input);
  } catch {
    throw new Error("Please provide a valid YouTube URL or video ID");
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  let videoId;
  if (host === "youtu.be") videoId = url.pathname.split("/").filter(Boolean)[0];
  if (["youtube.com", "m.youtube.com"].includes(host)) {
    if (url.pathname === "/watch") videoId = url.searchParams.get("v");
    if (url.pathname.startsWith("/embed/") || url.pathname.startsWith("/shorts/")) {
      videoId = url.pathname.split("/")[2];
    }
  }

  if (!YOUTUBE_ID_PATTERN.test(videoId || "")) {
    throw new Error("Please provide a valid YouTube URL or video ID");
  }
  const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
  // Keep only playback parameters that are safe and useful in an iframe.
  for (const parameter of ["list", "start", "end"]) {
    const parameterValue = url.searchParams.get(parameter);
    if (parameterValue) embedUrl.searchParams.set(parameter, parameterValue);
  }
  return embedUrl.toString();
};

module.exports = { toYoutubeEmbedUrl };
