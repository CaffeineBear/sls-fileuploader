const Responses = require('../common/responses');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const bucketName = process.env.s3bucketName;
const s3 = new AWS.S3();

exports.handler = async event => {
  if (!event.body) {
    return Responses(400, { message: 'Missing body'});
  }
  const body = JSON.parse(event.body);
  if (!body || !body.objectKey || !body.uploadId || !body.partTags) {
    return Responses(400, 'Invalid parameters');
  }

  /**
   * Parts tag should be the form of:
   * Part {
   *    ETag: string,
   *    PartNumber: number
   * }
   *
   * TODO: Add validator here for the parts.
   */
  const objectKey = body.objectKey;
  const uploadId = body.uploadId;
  const partTags = body.partTags;
  console.log(partTags);

  const params = {
    Bucket: bucketName,
    Key: objectKey,
    UploadId: uploadId,
    MultipartUpload: { Parts: partTags }
  }

  try {
    const res = await s3.completeMultipartUpload(params).promise();
    console.log(res);
    return Responses(200, { message: 'Complete Uploading'});

  } catch (err) {
    console.log(err);
    return Responses(400, { message: 'Error completing multi part uploading' });
  }
};
