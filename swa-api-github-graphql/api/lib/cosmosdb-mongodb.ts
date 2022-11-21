const { MongoClient, ObjectId } = require('mongodb');   

export async function insertData(enabled,mongoDbConnectionString, databaseName, collectionName, data, log){
      // insert into db
  if(enabled===true){
    log(`insertData enabled`);
  
    if (mongoDbConnectionString && databaseName && collectionName) {
      const dbResult = await insertBatch(
        mongoDbConnectionString,
        databaseName,
        collectionName,
        data,
        log
      );
    }
  } else {
    log(`insertData disabled`);
  }
}
export async function insertBatch(mongoDbConnectionString, databaseName, collectionName, data, log):Promise<void>{

    if(!mongoDbConnectionString) {
        log('mongoDbConnectionString is empty');
        return;
    }

    if(!databaseName) {
        log('databaseName is empty');
        return;
    }

    if(!collectionName) {
        log('collectionName is empty');
        return;
    }

    if(!data || data.length===0) {
        log('collectionName is empty');
        return;
    }
    const client = new MongoClient(mongoDbConnectionString);
    await client.connect();

    const insertResult = await client.db(databaseName).collection(collectionName).insertMany(data);

    log(insertResult);
    client.close();
}
