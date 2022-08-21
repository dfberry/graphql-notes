# GraphQL notes

- [Generate GraphQL Types with Apollo Codegen](https://www.apollographql.com/blog/tooling/apollo-codegen/typescript-graphql-code-generator-generate-graphql-types/)
- [Express with GraphQL](https://www.apollographql.com/blog/backend/using-express-with-graphql-server-node-js/)

## Next + GraphQL

* [Videos](https://www.youtube.com/playlist?list=PLN3n1USn4xlkDk8vPVtgyGG3_1eXYPrW-)

## API entry point is where?

- Server's schema.js file in the Query object

## Flow for adding new endpoint on server

### Add objects to schema

1. Add to `schema.js` in Query object to define query.
   - Define query or mutation
   - Define or modify existing types
   - Create new response types for new mutations

### Add Server entry points

1. Add to `api.js` to get data from REST API.

   ```
   incrementTrackViews(trackId) {
       return this.patch(`track/${trackId}/numberOfViews`);
   }
   ```

2. Add to `resolvers.js` to bridge from client to api. Make sure to use the same name as it appears in schema.

   ```
   const resolvers = {
       Query: {},
       Mutation: {
            // increments a track's numberOfViews property
            incrementTrackViews: async (_, { id }, { dataSources }) => {
                try {
                    const track = await dataSources.trackAPI.incrementTrackViews(id);
                    return {
                        code: 200,
                        success: true,
                        message: `Successfully incremented number of views for track ${id}`,
                        track,
                    };
                } catch (err) {
                    return {
                        code: err.extensions.response.status,
                        success: false,
                        message: err.extensions.response.body,
                        track: null,
                    };
                }
            },
   },
   ```

### Add Client UI and calls to server

1. Build query in sandbox
2. Add query to client react component with layout and dependencies - just get page to work - not adding gql yet
3. Add route to component
4. Back to react component to add gql const variable `GET_TRACK` with query from step 4. between backticks then send it to server with the useQuery hook.
5. Still in component, add loading, error, and data with QueryResult component to render.
6. Add detail component to this component and set props from data into subcomponent.

### Mutuation type

```
// server/schema.js
type Mutation {
    //verbType
    incrementTrackViews(id: ID!): Incremen
}
// Mutation response type with format verbTypeResponse
type incrementTrackViewsResponse {

    // all responses should have these
    code: Int!
    success: Boolean!
    message: String!

    // return all types modified
    track: Track
}
```

## Apollo course 1

- [REST API](https://odyssey-lift-off-rest-api.herokuapp.com/) with OpenApi view

## GitHub data

- [Playground](https://docs.github.com/en/graphql/overview/explorer)

### Queries with fragments

#### Query #1

```
query OrgInfo{
  organization(login:"jscomplete"){
    name
    description
    websiteUrl
  }
}
```

Response

```
{
  "data": {
    "organization": {
      "name": "jsComplete",
      "description": "Learn Full-stack JavaScript Development with Node, React, GraphQL, and more.",
      "websiteUrl": "https://jscomplete.com/"
    }
  }
}
```

#### Query #2

```
query MyRepos {
  viewer {
    ownedRepos:repositories(affiliations: OWNER, first:10){
      ...repoInfo
    }
    orgsRepos: repositories(affiliations: ORGANIZATION_MEMBER, first:10){
      ...repoInfo
    }
  }
}
fragment repoInfo on RepositoryConnection{
  nodes{
    nameWithOwner
    description
    forkCount
  }
}
```

Response

```
{
  "data": {
    "viewer": {
      "ownedRepos": {
        "nodes": [
          {
            "nameWithOwner": "dfberry/SpecFlow-NUnit-VS2010-Example",
            "description": "SpecFlow NUnit VS2010 Example",
            "forkCount": 0
          },
          {
            "nameWithOwner": "dfberry/SilverlightDataVisualization-ChartControl-BlogExample",
            "description": "Dynamic WP7 Charting: Static Resources versus Binding - This blog post is for other newbies trying to rework static resources into dynamic binding. ",
            "forkCount": 0
          },
          {
            "nameWithOwner": "dfberry/AzureWorkerRole",
            "description": "Sample Windows Azure Worker Role",
            "forkCount": 0
          },
          {
            "nameWithOwner": "dfberry/ElmahToAzureTableStorage",
            "description": "Extends Elmah to use Azure Table Storage",
            "forkCount": 0
          },
          {
            "nameWithOwner": "dfberry/WP7LoginChildWindow",
            "description": "How to create a ChildWindow Login Popup for Windows Phone 7",
            "forkCount": 0
          },
          {
            "nameWithOwner": "dfberry/WP7BackgroundAgentSample",
            "description": "The app uses a background process that does some work then updates the tile and pops up toast. The app and the agent talk to each other via an isolated storage file protected by a named mutex. The diagram below shows the pieces and how they work together.",
            "forkCount": 0
          },
          {
            "nameWithOwner": "dfberry/AzureMultiThreadedWorkerRole",
            "description": "I’ll show you how I combined multiple worker roles into a single, underutilized Azure web role thereby keeping the concept and design of worker roles while not having to pay extra for them. In order to verify the solution, the project uses Azure Diagnostics Trace statements. ",
            "forkCount": 0
          },
          {
            "nameWithOwner": "dfberry/SpecFlowNUnitSeleniumExample",
            "description": "Test MVC web page functionality via a SpecFlow Feature scenario. Test framework is NUnit. Web framework is Selenium. ",
            "forkCount": 0
          },
          {
            "nameWithOwner": "dfberry/WAZDashboard",
            "description": "Windows Azure Dashboard feeds regurgitated.",
            "forkCount": 0
          },
          {
            "nameWithOwner": "dfberry/HttpRequesterWindowsService",
            "description": "Windows Service in C# .Net 4.0 makes Http Requests based on stated timing intervals, emails results.",
            "forkCount": 0
          }
        ]
      },
      "orgsRepos": {
        "nodes": []
      }
    }
  }
}
```

### Fragments

```
fragment orgFields on Organization {
    name
    description
    websiteUrl
}
query OrgInfoWithFragment {
  organization(login: "jscomplete"){
    ...orgFields
  }
}
```

Response

```
{
  "data": {
    "organization": {
      "name": "jsComplete",
      "description": "Learn Full-stack JavaScript Development with Node, React, GraphQL, and more.",
      "websiteUrl": "https://jscomplete.com/"
    }
  }

```

## Star wars data

- [Playground](https://www.back4app.com/database/davimacedo/swapi-star-wars-api/graphql-playground)

## Queries

### Meta

#### Schema

```
fragment FullType on __Type {
  kind
  name
  fields(includeDeprecated: true) {
    name
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}
fragment InputValue on __InputValue {
  name
  type {
    ...TypeRef
  }
  defaultValue
}
fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}
query IntrospectionQuery {
  __schema {
    queryType {
      name
    }
    mutationType {
      name
    }
    types {
      ...FullType
    }
    directives {
      name
      locations
      args {
        ...InputValue
      }
    }
  }
}
```

## Facebook data

- [Playground](https://developers.facebook.com/tools/explorer)
