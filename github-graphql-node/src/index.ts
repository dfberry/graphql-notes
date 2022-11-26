import { AppConfiguration, getConfig } from "./config";
import {getGraphQLCursor, fetchGraphQLCursorJson} from './fetch-url';
import { QUERY_ORG_REPOS_AGGREGATE_VARIABLES,QUERY_ORG_REPOS_AGGREGATE } from "./queries";

async function loopThruCursors(appConfig:AppConfiguration, query: string, variables: Record<string, any>):Promise<any>{

  let hasNextPage = true; 
  let data = [];
  VARIABLES.after = null;

  do{

    const response = await getGraphQLCursor(
      appConfig.GitHubGraphQLUrl,
      appConfig.GitHubPersonalAccessToken,
      query,
      variables

      );

    if(!response.data.errors && response.status == 200 && 
      (response.data.data && response.data.data.organization && response.data.data.organization.repositories)){

        console.log(`returned: ${response.data.data.organization.repositories.pageInfo.startCursor}-${response.data.data.organization.repositories.pageInfo.hasNextPage}-${response.data.data.organization.repositories.pageInfo.endCursor}-${response.data.data.organization.repositories.edges.length}`)
        console.log(`${response.data.data.organization.repositories.edges[0].node.repositoryName}`)
        const graphQLData = response.data.data;
  
        hasNextPage = graphQLData.organization.repositories.pageInfo.hasNextPage;
        VARIABLES.after = graphQLData.organization.repositories.pageInfo.endCursor;
    
        const flattenEdge = graphQLData.organization.repositories.edges.map((edge: Record<string, any>) => edge.node);
        data.push(...flattenEdge);

    } else {
      throw Error(response.data.errors);
    }
    

  } while (hasNextPage)

  return data;
}
const QUERY = QUERY_ORG_REPOS_AGGREGATE;
const VARIABLES = QUERY_ORG_REPOS_AGGREGATE_VARIABLES;
const appConfig = getConfig();

loopThruCursors(appConfig, QUERY, VARIABLES)
.then(function (repositories) {
  console.log(repositories);
})
.catch(function (error) {
  console.log(error);
});
