export type OrgReposAggregateVariables = [
  organization: string,
  after: string | null,
  pageSize: number
]

export const QUERY_ORG_REPOS_AGGREGATE_VARIABLES= {
  "organization": "Azure-Samples",
  "after": null,
  "pageSize": +(process.env.GRAPHQL_CURSOR_SIZE || 100) 
}

export const QUERY_ORG_REPOS_AGGREGATE = `
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
`
