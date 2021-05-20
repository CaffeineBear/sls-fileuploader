const AWS = require('aws-sdk');

let options = {};
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  }

}

const documentClient = new AWS.DynamoDB.DocumentClient(options);

const get = async (ID, TableName) => {
  const params = {
    TableName, 
    Key: {
      ID,
    },
  }; 
  const data = await documentClient.get(params).promise();

  if (!data || !data.Item) {
    throw Error(`There was an error fetching the data for ${ID} from ${TableName}`);
  }
  console.log(data);

  return data.Item;
}

const write = async (data, TableName) => {
  if(!data.ID) {
    throw Error('no ID on the data');
  }

  const params = {
    TableName,
    Item: data
  };
  const res = await documentClient.put(params).promise();

  if (!res) {
    throw Error(`There was an error inserting ID of ${data.ID}) in table ${TableName}`);
  }
  return data;
};

const Dynamo = {
  get, write 
}

module.exports = Dynamo;
