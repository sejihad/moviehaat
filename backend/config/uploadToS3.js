const { PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const sharp = require("sharp");
const s3 = require("./s3");

const MAX_IMAGE_WIDTH = 1200;
const WEBP_QUALITY = 80;

const safeBaseName = (name = "upload") =>
  path
    .basename(name, path.extname(name))
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "upload";

const optimizeImageToWebp = async (file) => {
  const buffer = await sharp(file.data)
    .rotate()
    .resize({
      width: MAX_IMAGE_WIDTH,
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  return {
    body: buffer,
    contentType: "image/webp",
    extension: ".webp",
  };
};

async function uploadToS3(file, folder) {
  if (!file?.data || !file?.mimetype) {
    throw new Error("A valid upload file is required");
  }

  const isImage = file.mimetype.startsWith("image/");
  const uploadFile = isImage
    ? await optimizeImageToWebp(file)
    : {
        body: file.data,
        contentType: file.mimetype,
        extension: path.extname(file.name),
      };

  const key = `${folder}/${Date.now()}-${safeBaseName(file.name)}${
    uploadFile.extension
  }`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: uploadFile.body,
      ContentType: uploadFile.contentType,
      CacheControl: "public, max-age=31536000, immutable",
      ACL: "public-read",
    }),
  );

  return {
    key,
    // Keep and return the direct S3 origin URL for image calls.
    // CDN response conversion remains available in app.js for later use.
    url: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
}

module.exports = uploadToS3;
