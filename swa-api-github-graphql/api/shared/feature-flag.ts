export function isFeatureFlagEnabled(environmentVariables: string){

    return (environmentVariables.toLowerCase() === 'true')

}