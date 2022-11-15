const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const PAT = '';

const GRAPHQL_ENDPOINT_URL = 'https://api.github.com/graphql';

const QUERY = gql`
  query OrgInfo {
    organization(login: "jscomplete") {
      name
      description
      websiteUrl
    }
  }
`;

async function getData(id) {
  const data = JSON.stringify({
    query: QUERY,
    // variables: `{
    //     "id": "${id}"
    //   }`,
  });

  const response = await fetch(
    GRAPHQL_ENDPOINT_URL,
    {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        Authorization: 'Bearer ' + PAT,
        'User-Agent': 'Node',
      },
    }
  );

  const json = await response.json();
  console.log(json.data);
}

getData(1);