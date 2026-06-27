import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface RouteContext {
  params: {
    id: string;
  };
}

// Task title update
export async function PATCH(req: Request, context: RouteContext ) {
    const { id } = await context.params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const { title, priority } = await req.json();

    const result = await db.collection("tasks").updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, priority } }
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