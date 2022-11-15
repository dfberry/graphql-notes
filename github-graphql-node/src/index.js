var axios = require('axios');
require('dotenv').config();

const { QUERY_ORG_REPOS_AGGREGATE_VARIABLES,QUERY_ORG_REPOS_AGGREGATE } = require ("./queries");

const personal_access_token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
if(!personal_access_token) throw Error("missing personal access token");


const GRAPHQL_URL = process.env.GITHUB_GRAPHQL_ENDPOINT;
const QUERY = QUERY_ORG_REPOS_AGGREGATE;
const VARIABLES = QUERY_ORG_REPOS_AGGREGATE_VARIABLES;


// Assume variable for next cursor is `nextCursor`
async function getGraphQLCursor(url, personal_access_token, query, variables, nextCursor){

  // Set cursor
  if(nextCursor && ((typeof nextCursor)==='string') && (nextCursor.length>0)){
    variables.nextCursor = nextCursor;
  }

  // Prepare graphQL query for axios
  var data = JSON.stringify({
    query,
    variables
  });

  // Prepare HTTP request
  var config = {
    data,
    url,
    method: 'post',
    headers: { 
      'Authorization': 'Bearer ' + personal_access_token, 
      'Content-Type': 'application/json'
    },

  };

  const response = await axios(config);
  return response;

}

getGraphQLCursor(GRAPHQL_URL, personal_access_token, QUERY, VARIABLES, "")
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
