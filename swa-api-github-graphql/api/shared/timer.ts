export function delay(ms: number) {

    if(process.env.RATE_LIMIT_DELAY_IN_MS){

        const rateLimit = parseInt(process.env.RATE_LIMIT_DELAY_IN_MS) || ms;

        console.log(`wait ${rateLimit}`);
        return new Promise( resolve => setTimeout(resolve, rateLimit) );
    }

}