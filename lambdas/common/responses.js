const Responses = (statusCode, data) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods' : '*',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Credentials': true,
  }

  switch(statusCode) {
    case 200: 
      return {
        headers: headers,
        statusCode: statusCode,
        body: JSON.stringify(data),
      };
    case 400: 
      return {
        headers: headers,
        statusCode: statusCode,
        body: JSON.stringify(data),
      };
  }
};


module.exports = Responses;
