import {
  IndexApi,
  ResponseError,
  SearchApi,
  UtilsApi,
} from "manticoresearch-ts-dev";

import { myDataSource } from "../database/mysql";

interface Table {
  columns: { [key: string]: { type: string } }[];
  data: { [key: string]: string }[];
  total: number;
  error: string;
  warning: string;
}

interface IndexData {
  insert: {
    index: string;
    dbId: string;
    doc: {};
  };
}

const indexApi = new IndexApi();
const utilsApi = new UtilsApi();
const searchApi = new SearchApi();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mysql://root:root@localhost:8889/cape", {
  host: "localhost",
  dialect: "mysql",
});

export const getData = async () => {
  try {
    const rawQuery = "SELECT * FROM labels;";
    const [labels] = await sequelize.query(rawQuery);
    return labels;
  } catch (error: any) {
    console.log(error);
  }
};

const searchQuery = `SELECT * FROM labels WHERE value = 'AT' LIMIT 250`;

export const searchResults = async () => {
  const results = await sequelize.query(searchQuery, {
    type: Sequelize.QueryTypes.SELECT,
  });
  return results;
};

export const deleteIndex = async () => {
  await utilsApi.sql("drop table labels").then(() => console.log("dropped"));
  console.log(JSON.stringify(await utilsApi.sql("show tables")));
};

export const makeIndex = async (searchPhrase: any) => {
  console.log("making index");
  try {
    const tables: any[] = await utilsApi.sql("show tables");

    await utilsApi.sql(
      "create table labels(key string, value text, targetId string, dbid string, createdBy timestamp, createdAt timestamp, type text) morphology='stem_en'"
    );

    const extractedLabels = await getData();

    // console.log(extractedLabels);

    // const appendedData = () => {
    //   return extractedLabels.map((label) => ({ ...label, index: "labels" }));
    // };

    const transformedData = () => {
      try {
        return extractedLabels.map((obj) => {
          const { id, ...docWithoutId } = obj;

          return {
            insert: {
              index: "labels",
              doc: { dbId: obj.id, ...docWithoutId },
            },
          };
        });
      } catch (error: any) {
        console.log(error);
      }
    };

    // console.log(JSON.stringify(transformedData()));

    // await utilsApi.sql("drop table labels").then(() => console.log("dropped"));

    // await utilsApi.sql(
    //   "create table products(title text, price float) morphology='stem_en'"
    // );

    // await indexApi.insert({
    //   index: "labels",
    //   doc: {
    //     // id: 6,
    //     key: "brands",
    //     value: "merk1",
    //     targetId: "654a3020f9a5e4001b9a52c3",
    //     createdBy: 332,
    //     createdAt: "2023-11-07T12:40:00.000Z",
    //     type: "asset",
    //   },
    // });

    // console.log(JSON.stringify(await utilsApi.sql("select * from labels")));
    // console.log(JSON.stringify(await utilsApi.sql("select * from products")));

    // const results = await searchApi.search({
    //   index: "labels",
    //   query: { query_string: "@key subtype" },
    //   highlight: { fields: [] },
    // });

    // await indexApi.bulk(
    //   await transformedData()
    //     .map((label) => JSON.stringify(label))
    //     .join("\n")
    // );

    // for (const label of extractedLabels) {
    //   const { id, key, value, targetId, type } = label;

    //   const document = {
    //     key,
    //     value,
    //     targetId,
    //     type,
    //   };

    //   await indexApi.insert({
    //     index: "labels",
    //     doc: { ...document },
    //   });
    // }

    // console.log(JSON.stringify(results));
    // console.log(JSON.stringify(searchResults));

    // await utilsApi.sql(
    //   "create table collectionLinks(title text, price float) morphology='stem_en'"
    // );
    // await utilsApi.sql(
    //   "create table collections(title text, price float) morphology='stem_en'"
    // );
    // await utilsApi.sql(
    //   "create table labels(title text, price float) morphology='stem_en'"
    // );
    // await utilsApi.sql(
    //   "create table versions(title text, price float) morphology='stem_en'"
    // );

    // await indexApi.insert({
    //   index: "products",
    //   doc: { title: "Crossbody Bag with Tassel", price: 19.85 },
    // });
    // await indexApi.insert({
    //   index: "products",
    //   doc: { title: "microfiber sheet set", price: 19.99 },
    // });
    // await indexApi.insert({
    //   index: "products",
    //   doc: { title: "Pet Hair Remover Glove", price: 7.99 },
    // });
    // await indexApi.delete({
    //   index: "products",
    //   query: { range: { price: { lte: 20 } } },
    // });

    // console.log(`@title ${JSON.stringify(searchPhrase)}`);

    // console.log(searchPhrase);
    // const results = await searchApi.search({
    //   index: "products",
    //   query: { query_string: `@title ${searchPhrase.title}` },
    //   highlight: { fields: [] },
    // });

    // utilsApi
    //   .sql("SELECT * FROM products", true)
    //   .then((res) => console.log(JSON.stringify(res, null, 2)));

    // console.log("results " + JSON.stringify(results));

    // return results;

    // console.log(JSON.stringify(results));

    // const docs = [
    //   { insert: { index: "test", id: 1, doc: { title: "Title 1" } } },
    //   { insert: { index: "test", id: 2, doc: { title: "Title 2" } } },
    // ];

    // const userDocs = [];
    // const users = await myDataSource.getRepository(User).find();

    // for (const user of users) {
    //   const userDoc = {
    //     insert: {
    //       index: "userName",
    //       id: uuidv4(),
    //       doc: { name: user.firstName },
    //     },
    //   };
    //   console.log(userDoc.insert.doc);
    // }

    // const insertResponse = await indexApi.bulk(
    //   docs.map((doc) => JSON.stringify(doc)).join("\n")
    // );
    // console.info("Insert response:", JSON.stringify(insertResponse, null, 2));

    // console.info("Search response:", JSON.stringify(searchResponse, null, 2));
  } catch (error) {
    const errorResponse =
      error instanceof ResponseError ? await error.response.json() : error;
    console.error("Error response:", JSON.stringify(errorResponse, null, 2));
  }
};

export const searchLabel = async () => {
  const results = await utilsApi.sql(
    "select * from labels where match ('AT') LIMIT 250"
  );

  return results;
};

export const searchLabel2 = async () => {
  const searchResponse = await searchApi.search({
    index: "labels",
    query: { query_string: "@value AT" },
    limit: 250,
  });

  return searchResponse;
};
