'use strict';

module.exports.main = async event => {

   // Return secret from parameter store
  const EXAMPLE_SECRET = process.env.EXAMPLE_KEY;

  /**
   * Create a ServiceNow ticket
   * Method: POST
   */
  if(event.httpMethod === "POST" && event.body) {

    // let json = JSON.parse(event.body);
    let json = event.body;

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Creating ticket',
          object: json
        },
        null,
        2
      ),
    };
  }

  /**
   * Get a ServiceNow ticket by ID.
   */
  if(event.queryStringParameters && event.queryStringParameters.ticketId) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Returning ServiceNow ticket with ID: ' + escape(event.queryStringParameters.ticketId),
        },
        null,
        2
      ),
    };
  }


  /**
   * Default message
   */
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Welcome to serverless-now',
        aws_message: EXAMPLE_SECRET
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
