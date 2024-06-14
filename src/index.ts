import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { User } from "./entity/user.entity";
import { myDataSource } from "./database/mysql";
import "reflect-metadata";
var bodyParser = require("body-parser");

import SearchService from "./search/search.service";

import {
  deleteIndex,
  getData,
  makeIndex,
  searchLabel,
  searchLabel2,
  searchResults,
} from "./search/hc_indexer.service";

import {
  describeTables,
  dropTables,
  createIndexes,
  showTables,
  testMethod,
} from "./search/general_indexer.service";

import {
  createIndex,
  elasticSearch,
  indexData,
  testConnection,
  viewAllElastic,
} from "./search/elasticSearch.service";
import {
  createIndexWithMapping,
  createOpenSearchIndex,
  deleteOpenSearchIndex,
  listIndices,
  populateOpenSearchIndex,
  searchOpensearchINdex,
  testinsert,
  testOpenSearchConnection,
  testPopulateVersions,
} from "./search/openSearch.service";
// import { getMongoData } from "./search/manticore.mongo.service";
import {
  searchAcrossIndexes,
  showAll,
  suggest,
  testSearch,
} from "./search/manticore.search.service";
import {
  populateIndex,
  deleteMeilleiIndex,
  getAllMeiliData,
  testUpdate,
} from "./search/meiliSearch.service";
import { getLocalMongoData } from "./database/mongo";
import { getAtlasData } from "./search/manticore.mongo.service";
// import { createMeiliIndexes } from "./search/meiliSearch.service";

const service = new SearchService();

dotenv.config();

//start app
const app: Express = express();
const port = process.env.PORT || 3000;

//establish connection to mysql

myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//establish connection to mongo

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/getOne", async function (req: Request, res: Response) {
  const result = await myDataSource.getRepository(User).findOne({
    where: {
      firstName: req.body.firstName,
    },
  });

  console.log(result);

  return res.send(result);
});

app.get("/testGetTables", async function (req: Request, res: Response) {
  res.json(await makeIndex(""));
});

app.get("/dropManticoreTables", async function (req: Request, res: Response) {
  res.json(await dropTables());
});
app.get("/showManticoreTables", async function (req: Request, res: Response) {
  res.json(await showTables());
});
app.get(
  "/describeManticoreTables",
  async function (req: Request, res: Response) {
    res.json(await describeTables());
  }
);

app.get("/testGetSQL", async function (req: Request, res: Response) {
  res.json(await searchResults());
});

app.get("/createIndex", async function (req: Request, res: Response) {
  res.json(await makeIndex(""));
});

app.get("/deleteIndex", async function (req: Request, res: Response) {
  res.json(await deleteIndex());
});

app.get("/searchLabel", async function (req: Request, res: Response) {
  res.json(await searchLabel());
});

app.get("/searchLabel2", async function (req: Request, res: Response) {
  res.json(await searchLabel2());
});

app.get("/elasticSearchLabel", async function (req: Request, res: Response) {
  res.json(await elasticSearch());
});

app.get("/makeElasticIndex", async function (req: Request, res: Response) {
  res.json(await createIndex());
});
app.get("/elasticIndexData", async function (req: Request, res: Response) {
  res.json(await indexData());
});
app.get("/viewAllElastic", async function (req: Request, res: Response) {
  res.json(await viewAllElastic());
});

app.get("/searchManticoreMongo", async function (req: Request, res: Response) {
  res.json(await viewAllElastic());
});

app.get("/testConnection", async function (req: Request, res: Response) {
  res.json(await testConnection());
});

app.get("/testMongoConnection", async function (req: Request, res: Response) {
  // res.json(await getMongoData());
});

app.get(
  "/testOpenSearchConnection",
  async function (req: Request, res: Response) {
    res.json(await testOpenSearchConnection());
  }
);

app.post("/search", async function (req: Request, res: Response) {
  res.json(await searchAcrossIndexes(req.body.searchString));
});

app.get("/makeGeneralIndex", async function (req: Request, res: Response) {
  res.json(await createIndexes());
});
app.get("/testMethod", async function (req: Request, res: Response) {
  // await createIndexWithMapping();
  res.json(await testPopulateVersions());
});

app.get("/showAllData", async function (req: Request, res: Response) {
  res.json(await showAll());
});

app.get("/showSQLdata", async function (req: Request, res: Response) {
  res.json(await getData());
});

app.get("/createMeiliIndex", async function (req: Request, res: Response) {
  res.json(await populateIndex());
});

app.get("/getAllMeiliIndexes", async function (req: Request, res: Response) {
  res.json(await getAllMeiliData());
});

app.post("/deleteMeiliIndex", async function (req: Request, res: Response) {
  res.json(await deleteMeilleiIndex());
});

app.post("/suggest", async function (req: Request, res: Response) {
  res.json(await suggest(req.body.searchString));
});

app.put("/createOpenSearchIndex", async function (req: Request, res: Response) {
  res.json(await createOpenSearchIndex());
});

app.get("/listOpenSearchIndexes", async function (req: Request, res: Response) {
  res.json(await listIndices());
});

app.delete(
  "/deleteOpenSearchIndexes",
  async function (req: Request, res: Response) {
    res.json(await deleteOpenSearchIndex());
  }
);

app.get("/getLocalMongoData", async function (req: Request, res: Response) {
  res.json(await getLocalMongoData());
});

app.get("/getAtlasMongoData", async function (req: Request, res: Response) {
  res.json(await getAtlasData());
});

app.get("/populateOpenSearch", async function (req: Request, res: Response) {
  res.json(await populateOpenSearchIndex());
});

app.get("/searchOpenSearch", async function (req: Request, res: Response) {
  res.json(await searchOpensearchINdex(req.body.searchString));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
