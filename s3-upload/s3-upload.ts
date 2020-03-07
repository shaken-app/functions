import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

AWS.config.update({ region: process.env.REGION || "us-east-1" });

const s3 = new AWS.S3({
  accessKeyId: process.env.aws_id,
  secretAccessKey: process.env.aws_secret
});

interface NetlifyEvent {
  path: string;
  httpMethod: string;
  headers: Headers;
  queryStringParameters: { [arg: string]: any };
  body: string;
  isBase64Encoded: boolean;
}

exports.lambdaHandler = async () => await getUploadURL();
exports.handler = async (event: NetlifyEvent) => await getUploadURL(event);

const getUploadURL = async (event?: NetlifyEvent) => {
  let contentType = {};
  let ext = 'jpg';
  // @ts-ignore
  const params = event?.queryStringParameters;
  params?.type && (contentType = { 'Content-Type': params.type });
  params?.ext && (ext = params?.ext);

  const actionId = uuidv4();
  const s3Params = {
    Bucket: "shaken-assets",
    Key: `${actionId}.${ext}`,
    Expires: 600000,
    ACL: "public-read",
    ...contentType
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
          photoFilename: `${actionId}.jpg`,
          event
        })
      });
    } else {
      reject({
        statusCode: 400
      });
    }
  });
};
