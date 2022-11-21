/*
Task: accept file, as multipart form request, send file (100MB max on Consumption plan) to Azure Storage.
Run the curl command in the same directory as the file:
curl -X POST \
-F 'filename=@test-file.txt' \
-H 'Content-Type: text/plain' \
'http://localhost:7071/api/upload?filename=test-file.txt&containername=jsmith&directoryname=abc' --verbose

This curl command uses 3 pieces of data to successfully use the `parse-multipart` package
 to pass relevant data to and through this Azure Function:
* the querystring with filename property
* the multi-part form (-F) with the filename property
* the header with the correct content type

1. Make sure you append the Function key as the `code` property to the end of the url in your curl command: 
    curl -X POST \
    -F 'filename=@test-file.txt' \
    -H 'Content-Type: text/plain' \
    'http://localhost:7071/api/upload?filename=test-file.txt&containername=jsmith&directoryname=abc&code=123' --verbose

2. Set the Azure Storage connection string for the Function in the `AzureWebJobsStorage` property

Getting errors?
If you don't pass the `filename` in the form or send the `content-type` in the header, 
you should use a different npm package to handle form parsing or alter this
existing code to have default values before using the `parse-multipart` package.
*/
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { isFeatureFlagEnabled } from "../shared/feature-flag";
import HTTP_CODES from "http-status-enum";

// Multiform management
import * as multipart from "parse-multipart";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
    
    context.log('upload HTTP trigger function processed a request.');

    if(!isFeatureFlagEnabled(process.env.FEATURE_FLAG_UPLOAD_HTTP_TRIGGER_ENABLED)){
        context.log(`http trigger upload disabled`);
        return
    }
    context.log(`http trigger upload enabled`);

    console.log(req.headers);

    // get connection string to Azure Storage from environment variables
    // Replace with DefaultAzureCredential before moving to production
    const storageConnectionString = process.env.AzureWebJobsStorage;
    if (!storageConnectionString) {
        context.res.body = `AzureWebJobsStorage env var is not defined - get Storage Connection string from Azure portal`;
        context.res.status = HTTP_CODES.BAD_REQUEST
    }

    // Get container name
    const containername = req.query?.containername;
    if (!containername) {
        context.res.body = `containername is not defined`;
        context.res.status = HTTP_CODES.BAD_REQUEST
    }

    // Get direcrtory name
    const directoryname = req.query?.directoryname;
    if (!directoryname) {
        context.res.body = `directoryname is not defined`;
        context.res.status = HTTP_CODES.BAD_REQUEST
    }    

    // `filename` is required property to use multi-part npm package
    const filename = req.query?.filename;
    if (!filename) {
        context.res.body = `filename is not defined`;
        context.res.status = HTTP_CODES.BAD_REQUEST
    }

    // file content must be passed in as body
    if (!req.body || !req.body.length){
        context.res.body = `Request body is not defined`;
        context.res.status = HTTP_CODES.BAD_REQUEST
    }

    // Content type is required to know how to parse multi-part form
    if (!req.headers || !req.headers["content-type"]){
        context.res.body = `Content type is not sent in header 'content-type'`;
        context.res.status = HTTP_CODES.BAD_REQUEST
    }    

    console.log(`*** containername:${req.query?.containername}, directoryname:${req.query?.directoryname}, Filename:${req.query?.filename}, Content type:${req.headers["content-type"]}, Length:${req.body.length}`);
    
    try {

        // Each chunk of the file is delimited by a special string
        const bodyBuffer = Buffer.from(req.body);
        const boundary = multipart.getBoundary(req.headers["content-type"]);
        const parts = multipart.Parse(bodyBuffer, boundary);

        // The file buffer is corrupted or incomplete ?
        if (!parts?.length){
            context.res.body = `File buffer is incorrect`;
            context.res.status = HTTP_CODES.BAD_REQUEST
        }

        // filename is a required property of the parse-multipart package
        if(parts[0]?.filename)console.log(`Original filename = ${parts[0]?.filename}`);
        if(parts[0]?.type)console.log(`Content type = ${parts[0]?.type}`);
        if(parts[0]?.data?.length)console.log(`Size = ${parts[0]?.data?.length}`);

        // Passed to Storage
        context.bindings.storage = parts[0]?.data;
 
         // Returned to requestor
         context.res.body = {
            containername,
            filename,
            directoryname
          };

          console.log(context.res.body);

    } catch (err) {
        context.log.error(err.message);
        context.res.body = { error: `${err.message}`};
        context.res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;
    }

    return context.res;

};

export default httpTrigger;