export type TaskType = {  
    _id: string;
    title?: string;    
    priority?: null | "low" | "medium" | "high";
    deadline?: null | Date;
    completed: boolean;
    createdAt: Date;
    finishedAt?: null | Date;
}