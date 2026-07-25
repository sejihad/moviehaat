import Helmet from "react-helmet";

const SITE_NAME = "MovieHaat";
const DEFAULT_DESCRIPTION = "Discover trending movies, latest releases, reviews and stories from the world of cinema on MovieHaat.";
const DEFAULT_KEYWORDS = "movies, watch movies, movie reviews, latest movies, trending movies, cinema, MovieHaat";

const MetaData = ({ title, description = DEFAULT_DESCRIPTION, keywords = DEFAULT_KEYWORDS, image, url, type = "website", noIndex }) => {
  const pageTitle = title ? (title.toLowerCase().includes(SITE_NAME.toLowerCase()) ? title : `${title} | ${SITE_NAME}`) : `${SITE_NAME} | Discover Movies & Cinema Stories`;
  const canonicalUrl = url || (typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "");
  const absoluteImage = image && canonicalUrl ? new URL(image, canonicalUrl).href : image;
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const privatePath = /^\/(admin|profile|password|google-success)/.test(pathname) || pathname === "/login";
  const shouldNoIndex = noIndex ?? privatePath;
  return <Helmet>
    <html lang="en" />
    <title>{pageTitle}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="robots" content={shouldNoIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
    {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    {absoluteImage && <meta property="og:image" content={absoluteImage} />}
    {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
    <meta property="og:type" content={type} />
    <meta name="twitter:card" content={absoluteImage ? "summary_large_image" : "summary"} />
    <meta name="twitter:title" content={pageTitle} />
    <meta name="twitter:description" content={description} />
    {absoluteImage && <meta name="twitter:image" content={absoluteImage} />}
  </Helmet>;
};

export default MetaData;
