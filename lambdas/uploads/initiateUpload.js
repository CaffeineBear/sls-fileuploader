const Responses = require('../common/responses');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const bucketName = process.env.s3bucketName;
const s3 = new AWS.S3();

exports.handler = async event => {
  if (!event.body) {
    return Responses(400, { message: 'Missing body'});
  }
  let body = null;
  try {
    body = JSON.parse(event.body);
    if (!body || !body.fileName) {
      return Responses(400, {message: 'Invalid parameters'});
    }
  } catch(err) {
    return Responses(400,  {message: 'Invalid Body'});
  }

  console.log(event.requestContext.authorizer);
  
  const fileName = body.fileName;
  let userSub = 'testSub';
  if (!process.env.IS_OFFLINE) {
    userSub = event.requestContext.authorizer.claims.sub;
  }     
  const objectKey = `protected/${userSub}/${uuidv4()}/${fileName}`;

  const baseParams = {
    Bucket: bucketName,
    Key: objectKey,
  };
  
  try {
    const res = await s3.createMultipartUpload(baseParams).promise()
    return Responses(200, { 
      uploadId: res.UploadId,
      objectKey: objectKey 
    });

  } catch (err) {
    console.log(err);
    return Responses(err['$metadata'].statusCode, { message: 'Error initializing upload' });
  }
};
