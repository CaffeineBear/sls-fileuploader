const Responses = require('../common/responses');
const Dynamo = require('../common/Dynamo');

const tableName = process.env.userTableName;
  
exports.handler = async event => {

  if (!event.pathParameters || !event.pathParameters.ID) {
    return Responses(400, 'missing the ID from the path');
  }

  let ID = event.pathParameters.ID;
  const user = JSON.parse(event.body);
  user.ID = ID;

  console.log(Dynamo);

  const newUser = await Dynamo.write(user, tableName).catch(err => {
    console.log('error in dynamodb write', err);
    return null;
  });
   
  if (newUser) {
    return Responses(200, { newUser });
  }
  return Responses(400, {message: 'Failed to write user by ID'});
};
