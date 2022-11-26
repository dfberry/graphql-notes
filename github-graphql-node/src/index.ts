import { getRepos } from "./aggregatedOrgRepos";
import { getUser } from './whoami';

async function main(){

    const user = await getUser();
    const repos = await getRepos();

    return {
        user,
        repos
    }

}

main().then((result)=>{
    console.log(result)
}).catch(err=> console.log(err))