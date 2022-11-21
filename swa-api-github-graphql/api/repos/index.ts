import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { processOrgList } from "../lib/save_data_to_storage";
import { isFeatureFlagEnabled } from "../shared/feature-flag";

import HTTP_CODES from "http-status-enum";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    
    context.log(`http_repos begin`);

    if(isFeatureFlagEnabled(process.env.FEATURE_FLAG_REPOS_HTTP_TRIGGER_ENABLED)){
      context.log(`http trigger enabled`);

      const orgList = context?.req?.body?.orgList || [];
      const insertIntoDb = isFeatureFlagEnabled(process.env.FEATURE_FLAG_INSERT_INTO_DB_ENABLED);

      await processOrgList(orgList, insertIntoDb, context.log);
    } else {
        context.log(`http trigger disabled`);
    }

  } catch (err) {

    context.log.error(err.message);
    context.res.body = { error: `${err.message}`};
    context.res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;

    context.log("Repos api completed with failure");
  }

  context.log(`Repos api completed`);
};

export default httpTrigger;
