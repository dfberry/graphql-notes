import {getRepos} from './repos_in_org';
import {uploadToBlob} from './upload_to_blob';
import {newCleanIsoDateAsString, conformToContainerNameRules} from '../shared/strings';

async function processOrg(orgName, log){

    if(!orgName) return;

    // fileName
    const filename = conformToContainerNameRules(`${orgName}-${newCleanIsoDateAsString()}`) + ".json"; 
    log(`filename = ${filename}`);

    // get data
    const data  = await getRepos(orgName, log);
    log(`data returned`);

    // save data
    const result = await uploadToBlob("daily-clean", orgName, filename, data, log);
    log(`data written`);
}

export async function processOrgList(log){
    const list = process.env.ORG_LIST || [
        "Azure",
        "Azure-Samples",
        "Microsoft",
        "MicrosoftDocs"
    ];

    for await(let item of list){
        log(`org ${item} 1`);
        await processOrg(item, log);
        log(`org ${item} 2`);
    }
}