var axios = require("axios");

export async function httpRequest(config):Promise<any>{

return axios(config);
}