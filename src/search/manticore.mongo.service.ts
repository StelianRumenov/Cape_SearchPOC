import { getLocalMongoData } from "../database/mongo";

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://INTERN-stelian:uC0qK5VjzfyeAWyc@cape-acceptance.pnhd1.mongodb.net/AssetManager-acc";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

export const getAtlasData = async () => {
  await client.connect();

  const db = client.db("capeLocal");
  const collection = db.collection("collection");

  return await collection.getMany({});
};
