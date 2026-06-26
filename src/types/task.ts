export type TaskType = {  
    _id: string;
    title?: string;
    completed: boolean;
    priority?: "low" | "medium" | "high";
}