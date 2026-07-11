export type TaskType = {  
    _id: string;
    title?: string;    
    priority?: "low" | "medium" | "high";
    deadline?: Date;
    completed: boolean;
}