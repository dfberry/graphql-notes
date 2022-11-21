import { AzureFunction, Context } from "@azure/functions";
import { processOrgList } from "../lib/save_data_to_storage";
import { isFeatureFlagEnabled } from "../shared/feature-flag";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {

    context.log(`timer_repos begin`);

    if(isFeatureFlagEnabled(process.env.FEATURE_FLAG_TIMER_TRIGGER_ENABLED)){

        const insertIntoDb = isFeatureFlagEnabled(process.env.FEATURE_FLAG_INSERT_INTO_DB_ENABLED);
        context.log(`timer trigger enabled`);
        
        // accept stored list instead of incoming list
        const incomingOrgList = undefined;
        await processOrgList(incomingOrgList, insertIntoDb, context.log);
    } else {
        context.log(`timer trigger disabled`);
    }


    context.log(`timer_repos end`);
};

export default timerTrigger;
