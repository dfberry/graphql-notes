import { dir } from "console";

const { BlobServiceClient } = require('@azure/storage-blob');

/*
All letters must be lowercase.

Names must be from 3 through 63 characters long.

Names must start or end with a letter or number.

Names can contain only letters, numbers, and the dash (-) character.

Every dash (-) character must be immediately preceded and followed by a letter or number; consecutive dashes are not permitted in container names.
*/
function conformToContainerNameRules(containerName){

  containerName = containerName.toLowerCase();
  containerName = containerName.substr(0,62);
  const replaced = containerName.replace(/[^-a-z0-9]/gi, '');

  return replaced

}

async function createBlobFromString(containerClient, blobName, fileContentsAsString, uploadOptions){

    // Create blob client from container client
    const blockBlobClient = await containerClient.getBlockBlobClient(blobName);
  
    // Upload string
    await blockBlobClient.upload(fileContentsAsString, fileContentsAsString.length, uploadOptions);
  
    return blockBlobClient.url;
  }

export async function uploadToBlob(containerName, directoryname, fileName, jsonData, log){

    const connString = process.env.BLOB_STORAGE_CONNECTION_STRING;
    if (!connString) throw Error('Azure Storage Connection string not found');

    const blobServiceClient = BlobServiceClient.fromConnectionString(connString);
    const correctedContainerName = conformToContainerNameRules(containerName);
    log(`correctedContainerName=${correctedContainerName}`);

    const containerClient = blobServiceClient.getContainerClient(correctedContainerName)
    await containerClient.createIfNotExists();

    const upLoadOptions = {};

    if(directoryname){
      directoryname = conformToContainerNameRules(directoryname);
      fileName = `${directoryname}/${fileName}`;
    }

    const blobUrl = await createBlobFromString(containerClient, fileName, JSON.stringify(jsonData), upLoadOptions);
    log(blobUrl);
    
    return blobUrl;
}