// const { MeiliSearch } = require("meilisearch");
import { getData, fetchTableNames } from "./general_indexer.service";

import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: "http://127.0.0.1:7700",
  apiKey: "aSampleMasterKey",
});
export const populateIndex = async () => {
  const tableNames = await fetchTableNames();

  for (const tableName of tableNames) {
    client.createIndex(tableName, { primaryKey: "id" });
    const documents: any = await getData(`${tableName}`);

    let response = await client.index(tableName).addDocuments(documents);
    console.log(response);
  }
};

export const deleteMeilleiIndex = async () => {
  try {
    const tableNames = await fetchTableNames();
    for (const tableName of tableNames) {
      await client.deleteIndex(tableName);
      console.log(`Index '${tableName}' deleted successfully.`);
    }
  } catch (error) {
    console.error(`Failed to delete index. Error:`, error);
  }
};

export const getAllMeiliData = async () => {
  try {
    const indexes: any = await client.getIndexes();
    console.log(indexes.results);
    const documents: any = [];

    for (const index of indexes.results.Index) {
      //   const { name } = index.uid;
      //   const indexInstance = client.index(name);
      //   documents.push(await indexInstance.getDocuments());
      console.log(index);
      //   console.log(`Data from index ${name}:`, documents);
    }

    return documents;
  } catch (error: any) {
    console.log(error);
  }
};

export const testUpdate = async () => {
  try {
    client.updateIndex("resources", {
      primaryKey: "jobId",
    });
  } catch (error: any) {
    console.log(error);
  }
};
