export function conformToContainerNameRules(containerName){

    containerName = containerName.toLowerCase();
    containerName = containerName.substr(0,62);
    const replaced = containerName.replace(/[^-a-z0-9]/gi, '');
  
    return replaced
  
  }

  export function newCleanIsoDateAsString(){
    const datetime = new Date().toISOString();
    const cleanedDateTime = conformToContainerNameRules(datetime);
    return cleanedDateTime;
  }