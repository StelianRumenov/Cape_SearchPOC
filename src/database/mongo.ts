import { MongoClient } from "mongodb";

// const url = "mongodb://localhost:27017";
const url =
  "mongodb+srv://INTERN-stelian:uC0qK5VjzfyeAWyc@cape-acceptance.pnhd1.mongodb.net/AssetManager-acc";

const dbName = "cape_local";
const collectionName = "collection";

const client = new MongoClient(url);

export const getLocalMongoData = async () => {
  client.connect();

  console.log("Connected successfully to MongoDB");

  const db = client.db(dbName);

  try {
    // Fetch all documents from a collection
    const documents = await db.collection(collectionName).find({}).toArray();

    // Do something with the documents
    // console.log("Documents:", documents);
    return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
  } finally {
    // Close the connection
    client.close();
  }
};
