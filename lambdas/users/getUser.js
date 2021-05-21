const Responses = require('../common/responses');
const Dynamo = require('../common/Dynamo');

const tableName = process.env.userTableName;
  
exports.handler = async event => {

  if (!event.pathParameters || !event.pathParameters.ID) {
    return Responses(400, 'missing the ID from the path');
  }

  let ID = event.pathParameters.ID;

  const user = await Dynamo.get(ID, tableName).catch(err => {
    console.log('Error in Dynamo Get', err);
    return null;
  })
  if (user) {
    return Responses(200, user);
  }
  return Responses(400, {message: 'No ID in data'});
};
