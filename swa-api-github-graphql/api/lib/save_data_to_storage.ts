var axios = require("axios");
import { getRepos } from "./repos_in_org";
import { uploadToBlob } from "./upload_to_blob";
import {
  newCleanIsoDateAsString,
  conformToContainerNameRules,
} from "../shared/strings";
import * as DefaultOrgList from "../data/default-org-list.json";
import { insertData } from "./cosmosdb-mongodb";

async function processOrg(
  orgName,
  containerName,
  gitHubRateLimitDelay,
  insertIntoDb,
  log
): Promise<Array<any>> {
  if (!orgName) return;

  // fileName
  const filename =
    conformToContainerNameRules(`${orgName}-${newCleanIsoDateAsString()}`) +
    ".json";
  log(`filename = ${filename}`);

  // get data
  const data: Array<any> = await getRepos(orgName, gitHubRateLimitDelay, log);
  log(`data returned`);



  // save data to storage
  const resultStorage = await uploadToBlob(
    containerName,
    orgName,
    filename,
    data,
    log
  );
  log(`data written`);
  return data;
}
async function getOrgList(url) {
  // Prepare HTTP request
  var config = {
    url,
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(config);
    if (response.status == 200 && response?.data?.length > 0) {
      return { data: response.data, error: undefined };
    } else {
      return { data: undefined, error: response.data.error };
    }
  } catch (err) {
    console.log(err);
    return { data: undefined, error: err?.response?.statusText };
  }
}
// incoming orgList overrides default and storage lists
export async function processOrgList(
  orgList: Array<string>,
  insertIntoDb = true,
  log: any
): Promise<any> {
  let gitHubRateLimitDelay = 0;

  if (process.env.RATE_LIMIT_DELAY_IN_MS) {
    gitHubRateLimitDelay = parseInt(process.env.RATE_LIMIT_DELAY_IN_MS);
  }
  log(`GitHub rate limit delay: ${gitHubRateLimitDelay}`);

  const containerName = process.env.BLOB_STORAGE_CONTAINER_NAME || "misc";

  if (!orgList) {
    let list = DefaultOrgList;
    log(`defaultorgList = ${JSON.stringify(DefaultOrgList)}`);

    if (process.env.ORG_LIST_URL) {
      const { data, error } = await getOrgList(process.env.ORG_LIST_URL);
      if (error === undefined) {
        log("new org list");
        log(data);
        orgList = data;
      } else {
        // no-op
        log("default org list");
        orgList = list;
      }
    }
  }

  if (!orgList || orgList.length === 0){
    log("no items in orgList");
    return;
  } 

  let dataSet = [];
  for await (let orgName of orgList) {
    log(`org ${orgName} 1`);
    const singleDataSet = await processOrg(
      orgName,
      containerName,
      gitHubRateLimitDelay,
      insertIntoDb,
      log
    );

    dataSet.push(singleDataSet);
  }
  log(`data collection complete`);
  return dataSet;

}
