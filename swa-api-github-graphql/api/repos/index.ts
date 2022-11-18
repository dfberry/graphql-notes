import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getRepos } from "../lib/repos_in_org";
import { uploadToBlob } from "../lib/upload_to_blob";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    context.log("HTTP trigger function processed a request.");
    const name = req.query.name || (req.body && req.body.name);

    if (!name) {
      context.res = {
        status: 404 /* Defaults to 200 */,
        body: "`name` is required param`",
      };
    }

    //const data = await getRepos(name);

    const data = {
        "color": "blue",
        "type": "dog"
    }

    const datetime = new Date().toISOString().replace(/:/g,"_").replace(".","_").replace("-","_");
    const blobUrl = await uploadToBlob(
      `org_${name}`,
      `azure_aggregage_${datetime}.json`,
      JSON.stringify(data)
    );

    context.res = {
      body: blobUrl,
    };
  } catch (err) {
    context.res = {
        status: 500,
        body: err
    }
  }
};

export default httpTrigger;
