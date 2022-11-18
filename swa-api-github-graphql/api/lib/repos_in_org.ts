var axios = require("axios");

const QUERY_ORG_REPOS_AGGREGATE_VARIABLES = {
  organization: "Azure-Samples",
  after: "",
  pageSize: parseInt(process.env.GRAPHQL_CURSOR_SIZE) || 100,
};

const QUERY_ORG_REPOS_AGGREGATE = `
  query OrgReposMegaInfoExample($organization:String!, $pageSize: Int, $after: String) {
    organization(login:$organization){
      repositories (after:$after, first: $pageSize, orderBy: {field: STARGAZERS, direction: DESC}){
          totalCount
          pageInfo {
            startCursor
            hasNextPage
            endCursor
          }
          edges {
            cursor
            node {
              repositoryName:name 
              id
                url
                descriptionHTML
                updatedAt
                stargazers {
                  totalCount
                }
                forks {
                  totalCount
                }
                issues(states:[OPEN]) {
                  totalCount
                }
                pullRequests(states:[OPEN]) {
                  totalCount
                }
                
            }
          }
        }
      }
    }
  `;

const personal_access_token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
if (!personal_access_token)
  throw Error("missing personal access token GITHUB_PERSONAL_ACCESS_TOKEN");

const GRAPHQL_URL = process.env.GITHUB_GRAPHQL_ENDPOINT;
if (!GRAPHQL_URL) throw Error("missing GRAPHQL_URL");

const QUERY = QUERY_ORG_REPOS_AGGREGATE;
const VARIABLES = QUERY_ORG_REPOS_AGGREGATE_VARIABLES;

// Assume variable for next cursor is `nextCursor`
async function getGraphQLCursor(url, personal_access_token, query, variables) {
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
}

export async function getRepos(name) {
  // noop instead of error
  if (!name) return {};

  let hasNextPage = true;
  let data = [];
  VARIABLES.after = null;

  do {
    const response = await getGraphQLCursor(
      GRAPHQL_URL,
      personal_access_token,
      QUERY,
      VARIABLES
    );

    if (
      !response.data.error &&
      response.status == 200 &&
      response.data.data &&
      response.data.data.organization &&
      response.data.data.organization.repositories
    ) {
      console.log(
        `returned: ${response.data.data.organization.repositories.pageInfo.startCursor}-${response.data.data.organization.repositories.pageInfo.hasNextPage}-${response.data.data.organization.repositories.pageInfo.endCursor}-${response.data.data.organization.repositories.edges.length}`
      );
      console.log(
        `${response.data.data.organization.repositories.edges[0].node.repositoryName}`
      );
      const graphQLData = response.data.data;

      hasNextPage = graphQLData.organization.repositories.pageInfo.hasNextPage;
      VARIABLES.after =
        graphQLData.organization.repositories.pageInfo.endCursor;

      const flattenEdge = graphQLData.organization.repositories.edges.map(
        (edge) => edge.node
      );
      data.push(...flattenEdge);
    } else {
      throw Error(response.data.error);
    }
  } while (hasNextPage);

  return data;
}
