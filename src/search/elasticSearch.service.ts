const { Client } = require("@elastic/elasticsearch");
import { getData } from "./hc_indexer.service";
const fs = require("node:fs");

const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "cobR616*UuHcsOfy=H2F",
  },
  tls: {
    ca: fs.readFileSync(
      "/Users/stelianrumenov/Downloads/elasticsearch-8.12.2/config/certs/http_ca.crt"
    ),
    rejectUnauthorized: false,
  },
});

export async function testConnection() {
  try {
    const body = await client.info(); // Perform a basic info request
    console.log(
      "Connection to Elasticsearch successful:",
      JSON.stringify(body)
    );
  } catch (error) {
    console.error("Error connecting to Elasticsearch:", error);
  }
}

export const createIndex = async () => {
  try {
    await client.indices.create({
      index: "labels",
      body: {
        mappings: {
          dynamic: "strict",
          properties: {
            id: { type: "keyword" },
            key: { type: "text" },
            value: { type: "text" },
            targetId: { type: "text" },
            createdBy: { type: "date" },
            createdAt: { type: "date" },
            type: { type: "text" },
          },
        },
      },
    });
  } catch (error: any) {
    console.log("Error elasticsearch: " + error);
  }
};

export const indexData = async () => {
  const datasource = await getData();

  try {
    await client.helpers.bulk({
      datasource,
      onDocument(doc: any) {
        return {
          index: { _index: "labels", _id: doc.id },
        };
      },
    });
  } catch (error: any) {
    console.log(error);
  }
};

export const elasticSearch = async () => {
  try {
    const results = await client.search({
      index: "labels",
      body: {
        query: {
          match: { value: "AT" },
        },
      },
    });
    return results;
  } catch (error: any) {
    console.log("Elastic " + error);
  }
};

export const viewAllElastic = async () => {
  const searchQuery = {
    index: "labels",
    body: {
      query: {
        match_all: {}, // Match all documents
      },
    },
  };
  try {
    const results = await client.search(searchQuery);
    console.log(JSON.stringify(results));
    return results;
  } catch (error: any) {
    console.log(error);
  }
};
