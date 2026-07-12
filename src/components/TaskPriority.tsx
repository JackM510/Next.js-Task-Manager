import { TaskType } from "../types/task"
import { XMarkIcon } from "@heroicons/react/24/outline";

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
    const orbClass = priorityClasses[newPriority ?? task.priority ?? "none"];

    return (
        <div className={`flex items-center cursor-pointer ${isNew || addPriority || task.priority ? "mr-3" : "mr-1"}`}>
            {/* ----- Update Priority ----- */}
            {addPriority ? (
                <div className="flex items-center gap-2">
                    {Object.keys(priorityClasses).filter(priority => priority !=="none").map(priority => (
                        <div key={priority} className="relative group">
                            {/* ----- Orb ----- */}
                            <div
                                className={`h-3 w-3 rounded-full cursor-pointer hover:scale-110 transition-transform ${priorityClasses[priority]}`}
                                onClick={() => {
                                    if (!isNew) {
                                        handleUpdate({ newPriority: priority });
                                    }
                                    setNewPriority(priority);
                                    setAddPriority(false);
                                }}
                            />
                            {/* ----- Tooltip ----- */}
                            <div
                                className="capitalize absolute left-1/2 -translate-x-1/2 opacity-0 mt-2 py-1 px-2 
                                    group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded"
                            >
                                {priority}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Priority Text W/ Orb
                <div className="flex items-center">
                    <div className="flex items-center relative group mr-1">
                        {/* ----- Orb ----- */}
                        <div
                            className={`h-3 w-3 rounded-full ${orbClass}`}
                            onClick={() => setAddPriority(true)}
                        />
                        {/* ----- Tooltip -----*/}
                        <div
                            className={`capitalize pointer-events-none absolute left-1/2 -translate-x-1/2 opacity-0 mt-2 py-1 px-2 
                                transition-opacity bg-gray-800 text-white text-xs rounded
                                ${!newPriority && !task.priority ? "group-hover:opacity-100" : "opacity-0"}`}
                        >
                            Priority
                        </div>
                    </div> 
                    
                    <div className="flex relative group">
                        {/* ----- Text ----- */}
                        {(isNew || (newPriority ?? task.priority)) && (
                            <span 
                                className="text-xs font-semibold capitalize text-gray-400"
                                onClick={() => setAddPriority(true)}
                            >
                                {(newPriority ?? task.priority ?? (isNew ? "Priority" : "")) &&
                                    `${newPriority ?? task.priority ?? ""} priority`}
                            </span>
                        )}
                        {(newPriority ?? task.priority) && (
                            <XMarkIcon
                                className="text-gray-500 h-3 w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                    setNewPriority(null);
                                    setAddPriority(false);
                                    
                                    if (!isNew) handleUpdate({ newPriority: null });
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

