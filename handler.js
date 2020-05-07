'use strict';
const axios = require("axios");

module.exports.main = async event => {

  const SERVICE_NOW_CLIENT = axios.create({
    baseURL: `https://api.${process.env.ENV}.auckland.ac.nz/service`,
    timeout: 1000,
    headers: {
      apiKey: process.env.SN_API_KEY_R
    }
  })

  // POST (Create) a new ServiceNow ticket
  if (event.httpMethod === "POST" && event.body) {
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
      // return await SERVICE_NOW_CLIENT.get(`/servicenow-readonly/table/u_request?sysparm_query=number=${event.queryStringParameters.ticketId}&sysparm_display_value=all`) // <-- Disabled until auth set up
      return await SERVICE_NOW_CLIENT.get(`/servicenow-readonly/table/u_request?sysparm_query=number=REQ1216647&sysparm_display_value=all`)
        .then(res => res.data.result[0])
        .then(res_ticket => res_ticket ? { statusCode: 200, body: JSON.stringify(res_ticket) } : { statusCode: 500, body: JSON.stringify('Error retrieving ticket from ServiceNow') })
    } catch (error) {
      console.error(error);
      return { statusCode: 500, body: JSON.stringify('Something went wrong.') };
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

};