const trimTrailingSlash = (value = "") => String(value).replace(/\/+$/, "");

const getCdnBaseUrl = () =>
  trimTrailingSlash(process.env.CLOUDFRONT_URL || process.env.AWS_CDN_URL || "");

const getS3BaseUrls = () => {
  const bucket = process.env.AWS_BUCKET;
  const region = process.env.AWS_REGION;
  if (!bucket) return [];

  return [
    region ? `https://${bucket}.s3.${region}.amazonaws.com` : null,
    `https://${bucket}.s3.amazonaws.com`,
    region ? `http://${bucket}.s3.${region}.amazonaws.com` : null,
    `http://${bucket}.s3.amazonaws.com`,
  ].filter(Boolean);
};

const replaceS3UrlWithCdn = (value) => {
  if (typeof value !== "string") return value;
  const cdnBaseUrl = getCdnBaseUrl();
  if (!cdnBaseUrl || !value.includes("amazonaws.com")) return value;

  return getS3BaseUrls().reduce(
    (updated, s3BaseUrl) => updated.replaceAll(s3BaseUrl, cdnBaseUrl),
    value,
  );
};

const cdnJsonReplacer = (_key, value) => replaceS3UrlWithCdn(value);

module.exports = { cdnJsonReplacer, getCdnBaseUrl, replaceS3UrlWithCdn };
