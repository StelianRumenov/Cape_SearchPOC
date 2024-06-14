import { ResponseError } from "manticoresearch-ts-dev";
import { addScopeOptionsGetter } from "sequelize-typescript";
import {
  client,
  indexApi,
  utilsApi,
  searchApi,
  sequelize,
} from "./general_indexer.service";

export async function searchAcrossIndexes(searchString: string) {
  try {
    console.log(searchString);
    const results = [];

    //get indexes
    const existingIndexes: any = await utilsApi.sql("SHOW TABLES", true);
    const indexValues: string[] = existingIndexes[0].data.map(
      (item: any) => item.Index
    );

    //search through indexes
    for (const index of indexValues) {
      results.push({
        index: index,
        results: await searchApi.search({
          index: "labels_index",
          query: {
            match: {
              _all: "@" + searchString, // Search in all fields
            },
          },
        }),
      });
    }

    console.log(JSON.stringify(results));
    return results;
  } catch (error) {
    const errorResponse =
      error instanceof ResponseError ? await error.response.json() : error;
    console.error("Error response:", JSON.stringify(errorResponse, null, 2));
  }
}

export async function suggest(searchString: string) {
  try {
    console.log(searchString);
    const results = [];

    //get indexes
    const existingIndexes: any = await utilsApi.sql("SHOW TABLES", true);
    const indexValues: string[] = existingIndexes[0].data.map(
      (item: any) => item.Index
    );

    //search through indexes
    for (const index of indexValues) {
      const query = `CALL SUGGEST('${searchString}', '${index}');`;

      results.push(await utilsApi.sql(query));
    }

    console.log(JSON.stringify(results));
    return results;
  } catch (error) {
    const errorResponse =
      error instanceof ResponseError ? await error.response.json() : error;
    console.error("Error response:", JSON.stringify(errorResponse, null, 2));
  }
}

export async function testSearch(searchString: string) {
  try {
    //
    const results = [];

    //search through indexes

    //   for (const index of indexValues) {
    console.log(`@value ${searchString}`);
    results.push(
      await searchApi.search({
        index: "labels",
        query: { query_string: `@value ${searchString}` },
        highlight: { fields: [] },
      })
    );

    console.log(results);
    return results;
  } catch (error) {
    const errorResponse =
      error instanceof ResponseError ? await error.response.json() : error;
    console.error("Error response:", JSON.stringify(errorResponse, null, 2));
  }
}

export async function showAll() {
  const results = [];

  const existingIndexes: any = await utilsApi.sql("SHOW TABLES", true);
  const indexValues: string[] = existingIndexes[0].data.map(
    (item: any) => item.Index
  );
  for (const index of indexValues) {
    results.push(await utilsApi.sql(`select * from ${index}`));
  }

  console.log(results);
  return results;
}
