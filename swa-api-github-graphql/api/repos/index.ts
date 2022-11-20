import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { processOrgList } from "../lib/save_data_to_storage";

import HTTP_CODES from "http-status-enum";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    
    context.log(`timer_repos begin`);
    await processOrgList(context.log);
    context.log(`timer_repos end`);

  } catch (err) {

    context.log.error(err.message);
    context.res.body = { error: `${err.message}`};
    context.res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;

    context.log("Repos api completed with failure");
  }

  context.log(`Repos api completed`);
};

export default httpTrigger;
