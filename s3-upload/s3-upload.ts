import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

AWS.config.update({ region: process.env.REGION || "us-east-1" });

const s3 = new AWS.S3({
  accessKeyId: process.env.aws_id,
  secretAccessKey: process.env.aws_secret
});

exports.lambdaHandler = async () => await getUploadURL();
exports.handler = async () => await getUploadURL();

const getUploadURL = async () => {
  const actionId = uuidv4();
  const s3Params = {
    Bucket: "shaken-assets",
    Key: `${actionId}.jpg`,
    ACL: "public-read"
  };

  return new Promise((resolve, reject) => {
    let uploadURL = s3.getSignedUrl("putObject", s3Params);
    if (uploadURL) {
      resolve({
        statusCode: 200,
        isBase64Encoded: false,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          uploadURL,
          photoFilename: `${actionId}.jpg`
        })
      });
    } else {
      reject({
        statusCode: 400
      });
    }
  });
};
