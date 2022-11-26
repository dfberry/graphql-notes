var axios = require("axios");
import { RequestInfo, RequestInit } from "node-fetch";
require("dotenv").config();

export async function getGraphQLCursor(
  url: string,
  personal_access_token: string,
  query: string,
  variables: Record<string, string>
) {
  try {
    // Prepare graphQL query for axios
    var data = JSON.stringify({
      query,
      variables,
    });

    // Prepare HTTP request
    var config = {
      data,
      url,
      method: "post",
      headers: {
        Authorization: "Bearer " + personal_access_token,
        "Content-Type": "application/json",
      },
    };

    const response = await axios(config);
    return response;
  } catch (err) {
    throw err;
  }
}

export async function fetchGraphQLCursorJson(
  url: string,
  personal_access_token: string,
  query: string,
  variables: Record<string, string>
) {
  // Prepare graphQL query for axios
  var data = JSON.stringify({
    query,
    variables,
  });

  // Prepare HTTP request
  var config = {
    data,
    url,
    method: "post",
    headers: {
      Authorization: "Bearer " + personal_access_token,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(config.url, config);
  const body = await response.json();
  return body;
}
