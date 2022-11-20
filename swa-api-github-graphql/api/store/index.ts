
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import HTTP_CODES from "http-status-enum";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
    
    context.log("Store api started");

    console.log(req.headers);

    // get connection string to Azure Storage from environment variables
    // Replace with DefaultAzureCredential before moving to production
    const storageConnectionString = process.env.BLOB_STORAGE_CONNECTION_STRING;
    if (!storageConnectionString) {
        context.res.body = `BLOB_STORAGE_CONNECTION_STRING env var is not defined - get Storage Connection string from Azure portal`;
        context.res.status = HTTP_CODES.BAD_REQUEST;
        throw Error(`BLOB_STORAGE_CONNECTION_STRING env var is not defined - get Storage Connection string from Azure portal`);
    }

    // Get container name
    const containername = req.body?.containername;
    if (!containername) {
        context.res.body = `containername is not defined`;
        context.res.status = HTTP_CODES.BAD_REQUEST;
        throw Error(`containername is not defined`);
    }

    // Get direcrtory name
    const directoryname = req.body?.directoryname;
    if (!directoryname) {
        context.res.body = `directoryname is not defined`;
        context.res.status = HTTP_CODES.BAD_REQUEST;
        throw Error(`directoryname is not defined`);
    }    

    // `filename` is required property 
    const filename = req.body?.filename;
    if (!filename) {
        context.res.body = `filename is not defined`;
        context.res.status = HTTP_CODES.BAD_REQUEST;
        throw Error(`filename is not defined`);
    }

    // `data` is required property 
    const data = req.body?.data;
    if (!data) {
        context.res.body = `data is not defined`;
        context.res.status = HTTP_CODES.BAD_REQUEST;
        return;
    }
   

    context.log(`*** containername:${req.body?.containername}, directoryname:${req.body?.directoryname}, filename:${req.body?.filename}`);
    
    try {

        // Passed to Storage
        context.bindings.storage = data;
 
         // Returned to requestor
         context.res.body = {
            containername,
            filename,
            directoryname
          };

          context.log(context.res.body);
          context.log("Store api completed successfully");

    } catch (err) {
        context.log.error(err.message);
        context.res.body = { error: `${err.message}`};
        context.res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;
        context.log("Store api completed with failure");
    }
    context.log("Store api completed");
    return context.res;

};

export default httpTrigger;