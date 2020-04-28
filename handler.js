'use strict';

const axios = require("axios");

module.exports.main = async event => {

   // Return secret from parameter store
  const EXAMPLE_SECRET = process.env.EXAMPLE_KEY;

  const SERVICE_NOW_CLIENT = axios.create({
    baseURL: `https://api.${process.env.ENV}.auckland.ac.nz/service`,
    timeout: 1000,
    headers: {
      'apiKey': ''
    }
  })

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

    let ticket = {};
    try {
        ticket = await SERVICE_NOW_CLIENT.get(`/servicenow-readonly/table/u_request?sysparm_query=number=${event.queryStringParameters.ticketId}&sysparm_display_value=all`)
          .then(res => res.data.result[0]);
    } catch(error) {
      console.error(error);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Returning ServiceNow ticket with ID: ' + escape(event.queryStringParameters.ticketId),
          short_description: ticket && ticket.short_description && ticket.short_description.value
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
};
