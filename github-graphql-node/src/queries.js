const QUERY_ORG_REPOS_AGGREGATE_VARIABLES= {
  "organization": "Azure-Samples",
  "after": "",
  "pageSize": 100
}

const QUERY_ORG_REPOS_AGGREGATE = `
query OrgReposMegaInfoExample($organization:String!, $pageSize: Int) {
    organization(login:$organization){
      repositories (first: $pageSize, orderBy: {field: STARGAZERS, direction: DESC}){
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

module.exports = {
    QUERY_ORG_REPOS_AGGREGATE_VARIABLES,
    QUERY_ORG_REPOS_AGGREGATE
}