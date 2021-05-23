const Responses = require('../common/responses');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const bucketName = process.env.s3bucketName;
const s3 = new AWS.S3();

exports.handler = async event => {
  if (!event.body ) {
    return Responses(400, {message: 'missing the body'});
  }
  const body = JSON.parse(event.body);
  if (!body.objectKey || !body.uploadId) {
    return Responses(400, {message: 'missing the file key or upload id'});
  }
  
  const params = {
    Bucket: bucketName,
    Key: body.objectKey,
    UploadId: body.uploadId,
  };


  try {
    const res = await s3.abortMultipartUpload(params);
    console.log(res);
    return Responses(200, 'aborted');

  } catch (err) {
    console.log(err);
    return Responses(
      err['$metadata'].httpStatusCode, 
      { message: 'Error aborting upload' }
    );
  }
}; 
