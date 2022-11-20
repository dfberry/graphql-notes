import { AzureFunction, Context } from "@azure/functions";
import { processOrgList } from "../lib/save_data_to_storage";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {

    context.log(`timer_repos begin`);
    await processOrgList(context.log);
    context.log(`timer_repos end`);
};

export default timerTrigger;
