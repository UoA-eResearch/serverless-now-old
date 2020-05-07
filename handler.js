'use strict';

module.exports.main = async event => {
  const BASE_URL = `https://api.${process.env.ENV}.auckland.ac.nz/service`;

  // POST (Create) a new ServiceNow ticket
  if (event.httpMethod === "POST" && event.body) {
    // TODO: Enable POST to ServiceNow
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Creating ticket',
        object: event.body
      })
    };
  }

  // GET a ServiceNow ticket by ticket ID URL parameter
  if (event.queryStringParameters && event.queryStringParameters.ticketId) {
    try {
      // TODO: Replace hardcoded ticket with ${event.queryStringParameters.ticketId}
      return await getRes(`/servicenow-readonly/table/u_request?sysparm_query=number=REQ1216647&sysparm_display_value=all`, process.env.SN_API_KEY_R)
        .then(res => ([res] = res.result) ? // Destructure to first object in result array (first ticket)
          { statusCode: 200, body: JSON.stringify(res) } :
          { statusCode: 500, body: JSON.stringify('Error retrieving ticket from ServiceNow') })
    } catch (error) {
      console.error(error);
      return { statusCode: 500, body: JSON.stringify('Task failed successfully.') };
    }
  }

  // Default '/' page
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Welcome to serverless-now',
      aws_message: process.env.EXAMPLE_KEY
    })
  };

  // Function for getting data and returning the JSON result
  // Will make a POST request if the optional data argument is passed
  function getRes(url, apiKey, data = null) {
    return fetch(BASE_URL + url, {
      method: data ? 'POST' : 'GET',
      headers: {
        apiKey: apiKey
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
  }

};