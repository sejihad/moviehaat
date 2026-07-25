const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("./s3");

const deleteFromS3 = async (key) => {
  if (!key) return;
  await s3.send(
    new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET, Key: key }),
  );
};

module.exports = deleteFromS3;
