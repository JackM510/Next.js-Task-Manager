import { TaskType } from "../types/task"


type TaskPriorityProps = {
    task: TaskType;
    isNew: boolean;
    addPriority: boolean;
    setAddPriority: (value: boolean) => void;
    newPriority: string | null;
    setNewPriority: (value: string | null) => void;
    handleUpdate: (args: { newPriority?: string | null }) => void;
}



export default function TaskPriority({ task, isNew, addPriority, setAddPriority, newPriority, setNewPriority, handleUpdate }: TaskPriorityProps) {

    // Priority colour/text classes
    const priorityClasses: Record<string, string> = {
            none: "bg-gray-400 text-white",
            low: "bg-emerald-400 text-white",
            medium: "bg-amber-400 text-white",
            high: "bg-rose-600 text-white"
        }



    return (
        <div className="flex items-center mt-2 gap-2">
            {/* Add/Update Priority */}
            {addPriority ? (
                <div className="flex gap-2">
                    {Object.keys(priorityClasses).map(priority => (
                        <div key={priority} className="relative group">
                            {/* Orb */}
                            <div
                                className={`h-3 w-3 rounded-full cursor-pointer hover:scale-110 transition-transform ${priorityClasses[priority]}`}
                                onClick={() => {
                                    const value = priority === "none" ? null : priority
                                    if (!isNew) {
                                        handleUpdate({ newPriority: value });
                                    }
                                    setNewPriority(value);
                                    setAddPriority(false);
                                }}
                            />
                            {/* Tooltip */}
                            <div
                                className="capitalize absolute left-1/2 -translate-x-1/2 opacity-0 mt-2 py-1 px-2 
                                    group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded"
                            >
                                {priority === "none" ? "None" : priority}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Priority Text W/ Orb
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => setAddPriority(true)}>
                    <div className="relative group">
                        {/* Priority orb */}
                        <div
                            className={`h-3 w-3 rounded-full ${priorityClasses[newPriority ?? task.priority ?? "none"]
                                }`}
                        />
                        {/* No Priority tooltip */}
                        {(!newPriority && !task.priority) && (
                            <div
                                className="capitalize absolute left-1/2 -translate-x-1/2 opacity-0 mt-2 py-1 px-2 
                                    group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded"
                            >
                                Priority
                            </div>
                        )}
                    </div>
                    {/* Priority text */}
                    {(isNew || (newPriority ?? task.priority)) && (
                        <span className="text-xs font-semibold capitalize text-gray-400">
                            {(newPriority ?? task.priority ?? (isNew ? "Priority" : "")) &&
                                `${newPriority ?? task.priority ?? ""} priority`}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

