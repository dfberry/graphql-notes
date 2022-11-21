import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { processOrgList } from "../lib/save_data_to_storage";
import { isFeatureFlagEnabled } from "../shared/feature-flag";
import { insertData } from "../lib/cosmosdb-mongodb";

import HTTP_CODES from "http-status-enum";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    
    context.log(`http_db begin`);

    if(isFeatureFlagEnabled(process.env.FEATURE_FLAG_INSERT_INTO_DB_ENABLED)){
      context.log(`http trigger db enabled`);

      const data = context?.req?.body || [];

      const connectionString = process.env.COSMOSDB_CONNECTION_STRING;
      const databaseName = process.env.COSMOSDB_DATABASE_NAME;
      const collectionName = process.env.COSMOSDB_COLLECTION_NAME;

      await insertData(true,connectionString, databaseName, collectionName, data, context.log);
    } else {
        context.log(`http trigger db disabled`);
    }

  } catch (err) {

    context.log.error(err.message);
    context.res.body = { error: `${err.message}`};
    context.res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;

    context.log("DB api completed with failure");
  }

  context.log(`DB api completed`);
};

export default httpTrigger;
