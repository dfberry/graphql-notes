var axios = require("axios");
import { delay } from "../shared/timer";
const QUERY_ORG_REPOS_AGGREGATE_VARIABLES = {
  organization: "Azure-Samples",
  after: "",
  pageSize: parseInt(process.env.GRAPHQL_CURSOR_SIZE) || 100,
};
import { insertData } from "./cosmosdb-mongodb";

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
                vulnerabilityAlerts(states:[OPEN]){
                  totalCount
                }
                watchers {
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
async function insertIntoDb(data, log) {
  // insert into DB
  const connectionString = process.env.COSMOSDB_CONNECTION_STRING;
  const databaseName = process.env.COSMOSDB_DATABASE_NAME;
  const collectionName = process.env.COSMOSDB_COLLECTION_NAME;

  const dbresponse = await insertData(
    true,
    connectionString,
    databaseName,
    collectionName,
    data,
    log
  );

  return dbresponse;
}
export async function getRepos(
  name,
  gitHubRateLimitDelay,
  log
): Promise<Array<any>> {
  let data = [];

  try {
    log(`Get repos for ${name}`);

    // noop instead of error
    if (!name) return [];

    let hasNextPage = true;

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
        // log(
        //   `returned: ${response.data.data.organization.repositories.pageInfo.startCursor}-${response.data.data.organization.repositories.pageInfo.hasNextPage}-${response.data.data.organization.repositories.pageInfo.endCursor}-${response.data.data.organization.repositories.edges.length}`
        // );
        // log(
        //   `${response.data.data.organization.repositories.edges[0].node.repositoryName}`
        // );
        const graphQLData = response.data.data;

        hasNextPage =
          graphQLData.organization.repositories.pageInfo.hasNextPage;
        VARIABLES.after =
          graphQLData.organization.repositories.pageInfo.endCursor;

        const flattenEdge = graphQLData.organization.repositories.edges.map(
          (edge) => edge.node
        );

        const remappedArray = flattenEdge.map((repo: any) => {
          const totals = {
            total_stargazers: repo?.stargazers?.totalCount,
            total_forks: repo?.forks?.totalCount,
            total_issues: repo?.issues?.totalCount,
            total_pullrequests: repo?.pullRequests?.totalCount,
            total_watchers: repo?.watchers?.totalCount,
            total_vulnerabilityAlerts: repo?.vulnerabilityAlerts?.totalCount,
          };

          return {
            name,
            ...repo,
            ...totals,
            datetime: new Date().toUTCString(),
          };
        });

        // insert into db
        await insertIntoDb(remappedArray, log);

        data.push(...remappedArray);
      } else {
        // eat the error
        log(response.data.error);

        //throw Error(response.data.error);
      }
      await delay(gitHubRateLimitDelay);
    } while (hasNextPage);

    return data;
  } catch (err) {
    log(err);
    throw err;
  } finally {
    return data;
  }
}
