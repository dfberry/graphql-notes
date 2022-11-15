var axios = require('axios');
var data = JSON.stringify({
  query: `query OrgInfo {
    organization(login: "jscomplete") {
      name
      description
      websiteUrl
    }
  }`,
  variables: {}
});

var config = {
  method: 'post',
  url: 'https://api.github.com/graphql',
  headers: { 
    'Authorization': 'Bearer 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', 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
