const { MongoClient } = require("mongodb");

const DATABASE_NAME = "CollegeDB";
const COLLECTION_NAME = "Students";

let client;
let collectionPromise;

async function getStudentsCollection() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not configured.");
  }

  if (!collectionPromise) {
    client = new MongoClient(process.env.MONGO_URI);
    collectionPromise = client.connect()
      .then(() => client.db(DATABASE_NAME).collection(COLLECTION_NAME))
      .catch((error) => {
        collectionPromise = null;
        throw error;
      });
  }

  return collectionPromise;
}

module.exports = { getStudentsCollection };