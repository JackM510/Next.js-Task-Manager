import clientPromise from "@/lib/mongodb";

export async function GET() {
    const client = await clientPromise; // Wait for MongoDB to finish connecting
    const db = client.db(process.env.MONGODB_DB); // Select the DB from .env-local
    const tasks = await db.collection("tasks").find({}).toArray(); // Fetch all tasks
    return Response.json(tasks, { status: 200 }); // Return tasks as JSON with 200 OK status
}

export async function POST(req: Request) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const data = await req.json();  // Read JSON sent in POST request and create as JS object
    const result = db.collection("tasks").insertOne(data); // Insert
    return Response.json(result, { status: 201 }); // Send response confirming insert with HTTP 201 (Created) 
}