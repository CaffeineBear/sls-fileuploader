const Responses = require('../common/responses');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const bucketName = process.env.s3bucketName;
const s3 = new AWS.S3({ signatureVersion: 'v4' });

exports.handler = async event => {
  if (!event.body) {
    return Responses(400, { message: 'Missing body'});
  }
  const body = JSON.parse(event.body);
  if (!body || !body.objectKey || !body.uploadId || !body.numParts || !body.operation) {
    return Responses(400, 'Invalid parameters');
  }
  const allowedS3Operations = [
    'getObject', 
    'putObject', 
    'deleteObject', 
    'AbortMultipartUpload',
    'ListBucket',
    'ListBucketMultipartUploads',
    'ListMultipartUploadParts',
  ];
  if ( !(allowedS3Operations.includes(body.operation)) ) {
    return Responses(400, 'Invalid operations');
  }

  const objectKey = body.objectKey;
  const uploadId = body.uploadId;
  const operation = body.operation;
  const parts = body.numParts;

  const baseParams = {
    Bucket: bucketName,
    Key: objectKey, 
  };

  const promises = [];

  try {
    if (parts > 1) {
      for (let index = 0; index < parts; index++) {
        promises.push(
          s3.getSignedUrlPromise('uploadPart', {
          ...baseParams,
          UploadId: uploadId,
          PartNumber: index + 1
        }));
      }
      const res = await Promise.all(promises);

      const presignedUrls = res.reduce((map, part, index) => {
        map[index] = part
        return map;
      }, {});

      return Responses(200, { presignedUrls });
    } 
    
    const presignedUrl = await s3.getSignedUrlPromise(operation, baseParams);
    return Responses(200, { presignedUrl });

  } catch (err) {
    console.log(err);
    return Responses(400, { message: 'Error making presignedUrls' });
  }
}; 
