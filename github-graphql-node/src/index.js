var axios = require('axios');
require('dotenv').config();

const { QUERY_ORG_REPOS_AGGREGATE_VARIABLES,QUERY_ORG_REPOS_AGGREGATE } = require ("./queries");

const personal_access_token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
if(!personal_access_token) throw Error("missing personal access token GITHUB_PERSONAL_ACCESS_TOKEN");

const GRAPHQL_URL = process.env.GITHUB_GRAPHQL_ENDPOINT;
if(!GRAPHQL_URL) throw Error("missing GRAPHQL_URL");

const QUERY = QUERY_ORG_REPOS_AGGREGATE;
const VARIABLES = QUERY_ORG_REPOS_AGGREGATE_VARIABLES;


// Assume variable for next cursor is `nextCursor`
async function getGraphQLCursor(url, personal_access_token, query, variables){

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

async function loopThruCursors(){
  let hasNextPage = true; 
  let data = [];
  VARIABLES.after = null;

  do{

    const response = await getGraphQLCursor(GRAPHQL_URL, personal_access_token, QUERY, VARIABLES);

    if(!response.data.error && response.status == 200 && 
      (response.data.data && response.data.data.organization && response.data.data.organization.repositories)){

        console.log(`returned: ${response.data.data.organization.repositories.pageInfo.startCursor}-${response.data.data.organization.repositories.pageInfo.hasNextPage}-${response.data.data.organization.repositories.pageInfo.endCursor}-${response.data.data.organization.repositories.edges.length}`)
        console.log(`${response.data.data.organization.repositories.edges[0].node.repositoryName}`)
        const graphQLData = response.data.data;
  
        hasNextPage = graphQLData.organization.repositories.pageInfo.hasNextPage;
        VARIABLES.after = graphQLData.organization.repositories.pageInfo.endCursor;
    
        const flattenEdge = graphQLData.organization.repositories.edges.map(edge => edge.node);
        data.push(...flattenEdge);

    } else {
      throw Error(response.data.error);
    }
    

  } while (hasNextPage)

  return data;
}

loopThruCursors()
.then(function (repositories) {
  console.log(repositories);
})
.catch(function (error) {
  console.log(error);
});
