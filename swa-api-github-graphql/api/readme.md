# GitHub org list processing 

## local.settings.json

```
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "GITHUB_PERSONAL_ACCESS_TOKEN": "",
    "GITHUB_GRAPHQL_ENDPOINT": "https://api.github.com/graphql",
    "GRAPHQL_CURSOR_SIZE": 100,
    "BLOB_STORAGE_CONNECTION_STRING": "",
    "URL_GET_DATA": "http://localhost:7071/api/repos",
    "URL_SAVE_DATA": "http://localhost:7071/api/store",
    "CRON_AZURE_SAMPLES": "",
    "BLOB_STORAGE_CONTAINER_NAME": "daily-2",
    "ORG_LIST_URL":"",
    "NODE_ENV":"development",
    "RATE_LIMIT_DELAY_IN_MS": 900,
    "COSMOSDB_CONNECTION_STRING":"",
    "COSMOSDB_DATABASE_NAME": "Analytics",
    "COSMOSDB_COLLECTION_NAME":"GitHub",
    "FEATURE_FLAG_TIMER_TRIGGER_ENABLED":false,
    "FEATURE_FLAG_REPOS_HTTP_TRIGGER_ENABLED": true
  }
}
```