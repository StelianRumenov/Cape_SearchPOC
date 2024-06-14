import { MongoClient } from "mongodb";

// const url = "mongodb://localhost:27017";
const url = "URL";

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
