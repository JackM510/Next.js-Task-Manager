import "dotenv/config";
import clientPromise from "./mongodb"
import { ObjectId } from "mongodb";


async function seedTasks() {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const tasks = db.collection("tasks");
    // Clear any existing data
    await tasks.deleteMany({}); 

    // Set a deadline (future and overdue)
    function setDeadline(hours: number, minutes: number, daysAhead: number) {
        return new Date(
            new Date().setHours(hours, minutes, 0, 0) + daysAhead * 24 * 60 * 60 * 1000);
    }
    // Set createdAt + finishedAt values using random dates
    function setPreviousDate(daysAgo: number) {
        return new Date(
            new Date().setHours(
            Math.floor(Math.random() * 24),
            Math.floor(Math.random() * 60),
            Math.floor(Math.random() * 60),
            Math.floor(Math.random() * 1000)
            ) - daysAgo * 24 * 60 * 60 * 1000
        );
    }

    // Insert below tasks
    await tasks.insertMany([
        {
            _id: new ObjectId(),
            title: "buy groceries",  
            priority: "low",
            deadline: null,
            completed: false,
            createdAt: setPreviousDate(2),
            finishedAt: null
        },
        {
            _id: new ObjectId(),
            title: "pay electricity bill",  
            priority: "high",
            deadline: setDeadline(9, 0, 15),
            completed: false,
            createdAt: setPreviousDate(2),
            finishedAt: null
        },
        {
            _id: new ObjectId(),
            title: "pick up parcel",  
            priority: null,
            deadline: null,
            completed: true,
            createdAt: setPreviousDate(4),
            finishedAt: setPreviousDate(2),
        },
        {
            _id: new ObjectId(),
            title: "book car service",  
            priority: "medium",
            deadline: setDeadline(13, 30, -2),
            completed: false,
            createdAt: setPreviousDate(5),
            finishedAt: null
        },
        {
            _id: new ObjectId(),
            title: "clean the house",  
            priority: "low",
            deadline: null,
            completed: false,
            createdAt: setPreviousDate(3),
            finishedAt: null
        },
        {
            _id: new ObjectId(),
            title: "pay internet bill",  
            priority: "high",
            deadline: setDeadline(18, 0, 7),
            completed: false,
            createdAt: setPreviousDate(5),
            finishedAt: null
        },
        {
            _id: new ObjectId(),
            title: "mow the garden",  
            priority: "low",
            deadline: null,
            completed: false,
            createdAt: setPreviousDate(7),
            finishedAt: null
        },
        {
            _id: new ObjectId(),
            title: "renew car rego",  
            priority: "high",
            deadline: setDeadline(19, 0, 31),
            completed: false,
            createdAt: setPreviousDate(2),
            finishedAt: null
        },
        {
            _id: new ObjectId(),
            title: "drop off recylcing",  
            priority: null,
            deadline: null,
            completed: false,
            createdAt: setPreviousDate(5),
            finishedAt: null
        },
        {
            _id: new ObjectId(),
            title: "lodge tax return",  
            priority: "medium",
            deadline: setDeadline(12, 0, -2),
            completed: false,
            createdAt: setPreviousDate(7),
            finishedAt: null
        },
        {
            _id: new ObjectId(),
            title: "pay mobile phone plan",  
            priority: null,
            deadline: null,
            completed: true,
            createdAt: setPreviousDate(6),
            finishedAt: setPreviousDate(4)
        },
        {
            _id: new ObjectId(),
            title: "wash car",  
            priority: null,
            deadline: null,
            completed: false,
            createdAt: setPreviousDate(2),
            finishedAt: null
        },
        {
            _id: new ObjectId(),
            title: "pay rent",  
            priority: "high",
            deadline: setDeadline(19, 0, 3),
            completed: false,
            createdAt: setPreviousDate(7),
            finishedAt: null
        },
        {
            _id: new ObjectId(),
            title: "Do washing",  
            priority: "low",
            deadline: null,
            completed: false,
            createdAt: setPreviousDate(2),
            finishedAt: null
        },
        {
            _id: new ObjectId(),
            title: "book holiday flights",  
            priority: null,
            deadline: null,
            completed: true,
            createdAt: setPreviousDate(13),
            finishedAt: setPreviousDate(8),
        }
    ]);
}
// Seed the tasks
seedTasks()
    .then(() => console.log("Seed complete"))
    .catch(console.error);