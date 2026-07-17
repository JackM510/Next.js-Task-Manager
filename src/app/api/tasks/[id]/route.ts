import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface RouteContext {
  params: {
    id: string;
  };
}

// Update Task
export async function PATCH(req: Request, context: RouteContext ) {
    const { id } = await context.params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    // Only update sent attributes - prevents null entries
    const data = await req.json();
    const update: any = {};
    if ("title" in data) update.title = data.title;
    if ("priority" in data) update.priority = data.priority;
    if ("deadline" in data) update.deadline = data.deadline;
    if ("completed" in data) update.completed = data.completed;
    if ("finishedAt" in data) update.finishedAt = data.finishedAt;

    await db.collection("tasks").updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
    );
    return Response.json({ ok: true });
}

// Delete task
export async function DELETE(req: Request, context: RouteContext) {
    const { id } = await context.params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection("tasks").deleteOne({_id: new ObjectId(id) })
    return Response.json({ ok: true });
}