import {
  IndexApi,
  ResponseError,
  UtilsApi,
  SearchApi,
} from "manticoresearch-ts-dev";
import { ApiClient } from "manticoresearch";
import { Sequelize } from "sequelize";

//create index if it doesn't exist
export const indexApi = new IndexApi();
export const utilsApi = new UtilsApi();
export const searchApi = new SearchApi();
export const client = new ApiClient();

export const sequelize = new Sequelize(
  "mysql://root:root@localhost:8889/cape",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

export const fetchTableNames = async () => {
  try {
    const [results] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'cape'"
    );

    const formattedTableNames = results.map((obj: any) => obj.table_name);

    return formattedTableNames;
  } catch (error: any) {
    console.log("Something went wrong when fetching table names: " + error);
  }
};
function arraysHaveSameValues(arr1: any[], arr2: any[]): boolean {
  // Make copies of the arrays and sort them
  const sortedArr1 = arr1
    .slice()
    .map((item) => (typeof item === "string" ? item.toLowerCase() : item))
    .sort();
  const sortedArr2 = arr2
    .slice()
    .map((item) => (typeof item === "string" ? item.toLowerCase() : item))
    .sort();

  // Check if arrays have the same length
  if (sortedArr1.length !== sortedArr2.length) {
    return false;
  }

  // Compare elements of both arrays
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }
  // If no mismatches are found, arrays have the same values
  return true;
}

export const getData = async (tableName: string) => {
  try {
    const rawQuery = `SELECT * FROM ${tableName};`;
    const [results] = await sequelize.query(rawQuery);
    return results;
  } catch (error: any) {
    console.log(error);
  }
};

export const getDataFromVersions = async () => {
  try {
    const rawQuery = `SELECT * FROM versions;`;
    const [results] = await sequelize.query(rawQuery);
    return results;
  } catch (error: any) {
    console.log(error);
  }
};
export const testMethod = async () => {
  try {
    const existingIndexes: any = await utilsApi.sql(
      "SELECT * FROM labels_index",
      true
    );
    const indexValues: string[] = existingIndexes[0].data.map(
      (item: any) => item.Index
    );

    console.log(indexValues);

    for (const i of indexValues) {
      console.log(JSON.stringify(i));
    }
  } catch (error) {
    const errorResponse =
      error instanceof ResponseError ? await error.response.json() : error;
    console.error("Error response:", JSON.stringify(errorResponse, null, 2));
  }
};

export const populateIndexes: any = async () => {
  const tableNames = await fetchTableNames();

  for (const tableName of tableNames) {
    const extractedData: any = await getData(tableName);
    console.log("ei tuka " + tableName);

    const transformedData: any = async () => {
      try {
        return extractedData.map((obj) => {
          const { id, ...docWithoutId } = obj;

          // Convert date-time objects to Unix timestamps
          const transformedDoc = Object.fromEntries(
            Object.entries(docWithoutId).map(([key, value]) => {
              if (value instanceof Date) {
                return [key, Math.floor(value.getTime() / 1000)]; // Convert milliseconds to seconds
              } else {
                // Replace null values with ""
                return [key, value === null ? "" : value];
              }
            })
          );

          return {
            insert: {
              index: tableName.toLowerCase(),
              doc: { dbId: obj.id, ...transformedDoc },
            },
          };
        });
      } catch (error) {
        const errorResponse =
          error instanceof ResponseError ? await error.response.json() : error;
        console.error(
          "Error response:",
          JSON.stringify(errorResponse, null, 2)
        );
      }
    };

    console.log(JSON.stringify(transformedData()));

    const insertResponse = await indexApi.bulk(
      transformedData()
        .map((doc) => JSON.stringify(doc))
        .join("\n")
    );
    console.log(JSON.stringify(insertResponse));
  }
};

export const createIndexes: any = async () => {
  // try {
  //get existing indexes
  const existingIndexes: any = await utilsApi.sql("SHOW TABLES", true);
  const indexValues: string[] = existingIndexes[0].data.map(
    (item: any) => item.Index
  );
  //get DB table namess
  const tableNames = await fetchTableNames();

  //check if each table has corresponding index
  if (arraysHaveSameValues(indexValues, tableNames)) {
    console.log("we good");
  }
  //todo consider how to only create missing indexes

  for (const tableName of tableNames) {
    const [results] = await sequelize.query(
      `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='cape' AND TABLE_NAME='${tableName}';`
    );

    const formattedColumnData = results
      .filter(
        (obj: any) => !(obj.COLUMN_NAME === "id" && obj.DATA_TYPE === "varchar")
      ) // Exclude "id" column with data type "string"
      .map((obj: any) => ({
        columnName: obj.COLUMN_NAME,
        dataType: obj.DATA_TYPE.replace("varchar", "text")
          .replace("datetime", "timestamp")
          .replace("enum", "text")
          .replace("tinyint", "int")
          .replace("mediumtext", "text"),
      }));

    console.log(JSON.stringify(formattedColumnData));

    // Constructing the SQL query dynamically
    let sqlQuery = `create table ${tableName}_index(`;
    formattedColumnData.forEach((column, index) => {
      sqlQuery += `${column.columnName} ${column.dataType}`;
      if (index < formattedColumnData.length - 1) {
        sqlQuery += ", ";
      }
    });

    // Adding morphology='stem_en' and linking db id to index option
    sqlQuery += ", dbid string) dict = 'keywords' min_infix_len='3'";

    // Execute the SQL query
    console.log("sql query: " + sqlQuery);
    await utilsApi.sql(sqlQuery);
  }
  for (const tableName of tableNames) {
    const extractedData: any = await getData(tableName);
    console.log("ei tuka " + tableName);

    const transformedData: any = () => {
      try {
        return extractedData.map((obj) => {
          const { id, ...docWithoutId } = obj;

          // Convert date-time objects to Unix timestamps
          const transformedDoc = Object.fromEntries(
            Object.entries(docWithoutId).map(([key, value]) => {
              if (value instanceof Date) {
                return [key, Math.floor(value.getTime() / 1000)]; // Convert milliseconds to seconds
              } else {
                // Replace null values with ""
                return [key, value === null ? "" : value];
              }
            })
          );

          return {
            insert: {
              index: tableName.toLowerCase(),
              doc: { dbId: obj.id, ...transformedDoc },
            },
          };
        });
      } catch (error) {
        const errorResponse =
          error instanceof ResponseError ? error.response.json() : error;
        console.error(
          "Error response:",
          JSON.stringify(errorResponse, null, 2)
        );
      }
    };

    console.log(JSON.stringify(transformedData()));

    try {
      const insertResponse = await indexApi.bulk(
        transformedData()
          .map((doc) => JSON.stringify(doc))
          .join("\n")
      );
      console.log(JSON.stringify(insertResponse));
    } catch (error) {
      const errorResponse =
        error instanceof ResponseError ? error.response.json() : error;
      console.error("Error response:", JSON.stringify(errorResponse, null, 2));
    }
  }
};

export const dropTables = async () => {
  try {
    const existingIndexes: any = await utilsApi.sql("SHOW TABLES", true);
    const indexValues: string[] = existingIndexes[0].data.map(
      (item: any) => item.Index
    );
    for (const indexName of indexValues) {
      await utilsApi.sql(`drop table ${indexName}`);
    }
  } catch (error) {
    const errorResponse =
      error instanceof ResponseError ? await error.response.json() : error;
    console.error("Error response:", JSON.stringify(errorResponse, null, 2));
  }
};
export const showTables = async () => {
  try {
    return await utilsApi.sql("show tables");
  } catch (error) {
    const errorResponse =
      error instanceof ResponseError ? await error.response.json() : error;
    console.error("Error response:", JSON.stringify(errorResponse, null, 2));
  }
};

export const describeTables = async () => {
  try {
    const results = [];
    const existingIndexes: any = await utilsApi.sql("SHOW TABLES", true);
    const indexValues: string[] = existingIndexes[0].data.map(
      (item: any) => item.Index
    );
    for (const indexName of indexValues) {
      console.log("tuka gledai " + indexName);
      console.log(JSON.stringify(await utilsApi.sql(`DESCRIBE ${indexName}`)));
      results.push(await utilsApi.sql(`DESCRIBE ${indexName}`));
    }
    return results;
  } catch (error) {
    const errorResponse =
      error instanceof ResponseError ? await error.response.json() : error;
    console.error("Error response:", JSON.stringify(errorResponse, null, 2));
  }
};

//check index is up to data with DB (maybe this would be a good candidate for a CQRS mini pattern?)
