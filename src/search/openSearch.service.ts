import {
  fetchTableNames,
  getData,
  getDataFromVersions,
} from "./general_indexer.service";
import { v4 as uuidv4 } from "uuid";
const { Client } = require("@opensearch-project/opensearch");
const fs = require("node:fs");
const axios = require("axios");

const client = new Client({
  node: "http://localhost:9201",
  // ssl: {
  //   ca: fs.readFileSync(
  //     "/Users/stelianrumenov/Desktop/express_app/intermediate.crt"
  //   ),
  // },
  auth: {
    username: "admin",
    password: "admin123.Cape",
  },
  // tls: {
  //   ca: fs.readFileSync(
  //     "/Users/stelianrumenov/Desktop/express_app/intermediate.pem"
  //   ),
  //   rejectUnauthorized: false,
  // },
});

export async function testOpenSearchConnection() {
  try {
    const body = await client.info();
    console.log("Connection to Elasticsearch successful:", body);
  } catch (error) {
    console.error("Error connecting to Open Search:", error);
  }
}

export async function listIndices() {
  try {
    const response = await axios.get("http://localhost:9200/_cat/indices");
    console.log("Indices:", response);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch indices:", error);
  }
}

export const createOpenSearchIndex = async () => {
  try {
    const tableNames = await fetchTableNames();

    for (const tableName of tableNames) {
      const lowercaseIndexName = tableName.toLowerCase(); // Convert indexName to lowercase

      await axios.put(`http://localhost:9200/${lowercaseIndexName}`);
    }
    console.log("index created successfully ");
  } catch (error: any) {
    console.log(error.response);
  }
};

export const deleteOpenSearchIndex = async () => {
  try {
    const tableNames = await fetchTableNames();

    for (const name of tableNames) {
      const lowercaseIndexName = name.toLowerCase(); // Convert indexName to lowercase
      await axios.delete(`http://localhost:9200/${lowercaseIndexName}`);
      console.log(`Index '${lowercaseIndexName}' deleted successfully.`);
    }
  } catch (error) {
    console.error(`Failed to delete index: `, error);
  }
};

export const testinsert = async () => {
  // await updateIndexSettings();
  let bulkRequestBody = {
    body: [
      { create: { _index: "jobs" } },
      {
        dbId: "001017f9-71b6-4250-9011-485491237f6f",
        accountId: 12,
        campaignId: 21139,
        startedBy: 3190,
        status: 2,
        startedOn: 1707470300,
        finishedOn: 1707470310,
        totalTasks: 3,
        finishedTasks: 3,
        failedTasks: 0,
        createdAt: 1707470299,
        updatedAt: 1707470310,
      },
      { create: { _index: "resources" } },
      { title: "Snow White", year: 2031, director: "Jake" },
      { create: { _index: "labels" } },
      {
        dbId: 6,
        key: "brands",
        value: "merk1",
        targetId: "654a3020f9a5e4001b9a52c3",
        createdBy: 332,
        createdAt: 1699360800,
        type: "asset",
      },
      { create: { _index: "products" } },
      {
        dbId: 1,
        jobId: "b2dec3d8-ed90-4178-aa1f-32d0e45294f5",
        name: "Campaign Data",
        value:
          '"{\\"settings\\":{\\"title\\":\\"PE v3 Test - NL - 17-07-2023\\",\\"brand\\":\\"\\",\\"department\\":\\"\\",\\"languages\\":{\\"EN\\":\\"EN - English\\"},\\"planning\\":{\\"online\\":\\"2024-01-13 07:56:35\\",\\"offline\\":\\"2024-02-12 07:56:35\\"}}}"',
        createdAt: 1701948005,
        updatedAt: 1701948005,
      },
      { create: { _index: "task_messages" } },
      {
        dbId: 1,
        taskId: 1234,
        type: "error",
        message: "123dfgsfdas",
        createdAt: 1711619387,
        updatedAt: 1711619387,
      },

      { create: { _index: "collectionlinks" } },
      {
        dbId: 50,
        collectionId: "654b6846efeac1001b92c518",
        assetId: "6556391bdd9a62be5007556e",
        rootCollectionId: "654b6846efeac1001b92c518",
        createdAt: 1700149947,
        updatedAt: 1700149947,
      },

      { create: { _index: "versions" } },
      {
        dbId: 1,
        accountId: 12,
        assetId: "659d31a303138748f13f73d0",
        createdBy: 777,
        createdAt: 1704800700,
        data: {
          id: "659d31a303138748f13f73d0",
          _id: "659d31a303138748f13f73d0",
          status: "available",
          createdAt: "2024-01-09T11:44:35.935Z",
          "collections.0": "65421c6d540e16001b996c59",
          processStatus: "processEnd",
          lastModifiedAt: "2024-01-09T11:44:35.935Z",
          "labels.brands.0": "duvel",
          "labels.brands.1": "merk1",
          "labels.brands.2": "merk2",
          "labels.markets.0": "CA",
          "labels.departments.0": "ecommerce",
          "labels.departments.1": "marketing",
        },
        versionNumber: 0,
        snapshot: {
          _id: "659d31a303138748f13f73d0",
          data: {
            files: [
              {
                id: "bb43d67c-82d4-4f71-9c67-04a5bae40a21",
                url: "https://storage.googleapis.com/asset-manager-acceptance/account-12/upload/bb43d67c-82d4-4f71-9c67-04a5bae40a21.jpg",
                hash: "381ba1d1ead1cb22161a714ca893552656cf31e9ed6321ca83bad2bbdc137a1b",
                size: "58726",
                preview: {
                  "854x480": {
                    url: "https://storage.googleapis.com/asset-manager-acceptance/account-12/preview/f0c8b53e-e887-4bd3-bea5-07a45bd23361.png",
                    width: 854,
                    height: 480,
                  },
                },
                category: "image",
                fileName:
                  "e573fb70-fb7d-11ec-b837-03d7f61ad818_36a33902-9b02-49e9-a384-88fa6d3ff6b3.jpg",
                extension: "jpg",
                humanSize: "57.35 kB",
                conversions: [
                  {
                    ext: "png",
                    url: "https://storage.googleapis.com/asset-manager-acceptance/account-12/conversions/ab8b7bad-0c94-4254-aec0-d21fa7fc651a.png",
                    fileSize: 456122,
                    humanFileSize: "445.43 kB",
                  },
                  {
                    ext: ".jpg",
                    url: "https://storage.googleapis.com/asset-manager-acceptance/account-12/conversions/e869c6f4-8920-4a67-81ab-153165c23b5f.-low.jpg",
                    fileSize: 10128,
                    humanFileSize: "9.89 kB",
                  },
                ],
              },
            ],
            thumbnail: {
              url: "https://storage.googleapis.com/asset-manager-acceptance/account-12/preview/19b459ee-db03-4d5a-90e2-667ceb297706.png",
              width: 614,
              height: 512,
            },
          },
          type: "media",
          title:
            "E573fb70 fb7d 11ec b837 03d7f61ad818 36a33902 9b02 49e9 a384 88fa6d3ff6b3",
          public: true,
          status: "available",
          accountId: 12,
          createdAt: "2024-01-09T11:44:35.935Z",
          createdBy: 777,
          customData: {
            createdBy: "Murat",
          },
          reviewState: "approved",
          lastModifiedAt: "2024-01-09T11:45:00.447Z",
          lastModifiedBy: 777,
        },
      },

      { create: { _index: "collections" } },
      {
        dbId: "65421c6d540e16001b996c59",
        accountId: 12,
        title: "First Collection",
        type: "media",
        parentId: "",
        createdBy: 332,
        createdAt: 1698831469,
        color: "",
        icon: "",
        privacy: "public",
        updatedBy: 1399,
        updatedAt: 1709498465,
      },

      { create: { _index: "action_logs" } },
      {
        dbId: 1,
        userId: -1,
        accountId: -1,
        subjectType: "job",
        subjectId: "null",
        action: "start",
      },

      { create: { _index: "tasks" } },
      {
        dbId: 1,
        path: "publishengine:reque:acceptance:sequential:abb79c0d-83a6-4070-9a2f-b07c4c64e58d:task:0",
        jobId: "abb79c0d-83a6-4070-9a2f-b07c4c64e58d",
        service: "utilities",
        type: "stringUrlEncode",
        version: 1,
        hasErrors: 0,
        hasWarnings: 0,
        startedOn: 1697805238,
        finishedOn: 1697805238,
        hasReports: 0,
      },
      { create: { _index: "pointers" } },
      {
        dbId: 1,
        accountId: 52,
        campaignId: 22266,
        key: "65312b89524eea66c231c5fe-id",
        value: "6470735935936",
        createdAt: 1698234505,
        updatedAt: 1698234505,
      },

      { create: { _index: "usagelogs" } },
      {
        dbId: 1,
        assetId: "654a30a008e9557769f44ea8",
        createdAt: 1707322095,
        campaignId: 1,
        userId: -1,
      },
    ],
  };
  try {
    await client.bulk(bulkRequestBody).then((response) => {
      console.log(JSON.stringify(response.body.items));
    });
  } catch (error: any) {
    console.log(JSON.stringify(error.response.data));
  }
};

export async function updateIndexSettings(indexName: string) {
  try {
    // Update index settings to increase the total fields limit
    const { body } = await client.indices.putSettings({
      index: indexName,
      body: {
        index: {
          mapping: {
            total_fields: {
              limit: 5000, // Increase the limit as needed
            },
          },
        },
      },
    });

    console.log(body);
  } catch (error) {
    console.error("Error updating index settings:", error);
  }
}

export const populateOpenSearchIndex = async () => {
  try {
    const tableNames = await fetchTableNames();

    for (const tableName of tableNames) {
      updateIndexSettings(tableName.toLowerCase());
      const documents = await getData(tableName);

      client.helpers
        .bulk({
          datasource: documents,
          onDocument(_) {
            return { index: { _index: tableName.toLowerCase() } };
          },
        })
        .then((result) => {
          console.log(tableName + JSON.stringify(result));
        });
    }
  } catch (error: any) {
    console.log(error.response);
  }
};

export const testPopulateVersions = async () => {
  try {
    //get all data from versions
    const docs = await getDataFromVersions();

    //loop and index each doc individually
    for (const doc of docs) {
      await client
        .index({
          id: uuidv4(),
          index: "versions",
          body: doc,
          refresh: true,
        })
        .then((response) => {
          if (response.statusCode != 201) {
            console.log(response.statusCode + JSON.stringify(doc));
          }
        });
    }
  } catch (error: any) {
    console.log(error);
  }
};

export async function createIndexWithMapping() {
  try {
    // Define the index mapping
    const mapping = {
      properties: {
        id: { type: "keyword" },
        accountId: { type: "keyword" },
        assetId: { type: "keyword" },
        createdBy: { type: "date" },
        createdAt: { type: "date" },
        data: { type: "object" },
        versionNumber: { type: "integer" },
        snapshot: { type: "object" },
      },
    };
    const { body } = await client.indices.create({
      index: "versions",
      body: {
        mappings: {
          properties: mapping.properties,
        },
      },
    });

    console.log(body);
    return body;
  } catch (error) {
    console.error("Error creating index with mapping:", error);
  }
}

export async function searchOpensearchINdex(searchString: string) {
  try {
    const tableNames = await fetchTableNames();
    let results = [];
    for (const tableName of tableNames) {
      const { body } = await client.search({
        index: tableName.toLowerCase(),
        body: {
          query: {
            multi_match: {
              query: searchString,
              fields: ["*"], // Search across all fields
            },
          },
        },
      });
      results.push({ tableName: tableName, body });
    }

    return results;
  } catch (error) {
    console.error("Error searching documents:", error);
  }
}
