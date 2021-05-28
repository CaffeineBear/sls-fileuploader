const Responses = require('../common/responses');
const AWS = require('aws-sdk');

const bucketName = process.env.s3bucketName;
const s3 = new AWS.S3();

exports.handler = async event => {
  if (!event.body) {
    return Responses(400, { message: 'Missing body'});
  }
  let body = null;
  try {
    body = JSON.parse(event.body);
    if (!body || !body.fileName || !body.folderName) {
      return Responses(400, {message: 'Invalid parameters'});
    }
  } catch(err) {
    return Responses(400,  {message: 'Invalid Body'});
  }
  console.log(body);

  const fileName = body.fileName;
  const folderName = body.folderName;
  const objectKey = `protected/${folderName}/${Date.now()}-${fileName}`;

  const baseParams = {
    Bucket: bucketName,
    Key: objectKey,
  };
  
  try {
    const res = await s3.createMultipartUpload(baseParams).promise();
    return Responses(200, { 
      uploadId: res.UploadId,
      objectKey: objectKey 
    });

  } catch (err) {
    console.log(err);
    return Responses(500, err.stack);
  }
};
