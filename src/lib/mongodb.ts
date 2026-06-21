// Connection helper

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!; // Read MongoDB URI from .env-local
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

// If URI is missing throw an error
if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env.local");
}

// If in development mode reuse existing connection; prevent new connections on refresh.
if (process.env.NODE_ENV === "development") {
    // If no global connection exists
    if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(uri, options);
        // Save connection promise globally so it can be reused
        (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;