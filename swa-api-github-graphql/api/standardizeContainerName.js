function conformToContainerNameRules(containerName){

    containerName = containerName.toLowerCase();
    containerName = containerName.substr(0,62);
    const replaced = containerName.replace(/[^-a-z0-9]/gi, '');

    return replaced

  }

  console.log(conformToContainerNameRules("HelLO_org-123$%^"));