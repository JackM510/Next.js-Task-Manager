import { TaskType } from "../types/task"
import { useMobileRevealX } from "../hook/useMobileRevealX"
import { FaCircle } from "react-icons/fa";
import { XMarkIcon } from "@heroicons/react/24/outline";

type TaskPriorityProps = {
    task: TaskType;
    isNew: boolean;
    addPriority: boolean;
    setAddPriority: (value: boolean) => void;
    newPriority: string | null;
    setNewPriority: (value: string | null) => void;
    handleUpdate: (args: { newPriority?: string | null }) => void;
    isTouchDevice: boolean;
}

export default function TaskPriority({ task, isNew, addPriority, setAddPriority, newPriority, setNewPriority, handleUpdate, isTouchDevice }: TaskPriorityProps) {
    // Track whether X should be shown by touching priority string if on touch device
    const { showX, setShowX, wrapperRef } = useMobileRevealX();
    // Priority colour classes
    const priorityClasses: Record<string, string> = {
        none: "text-gray-400",
        low: "text-emerald-400",
        medium: "text-amber-400",
        high: "text-rose-600"
    }
    const orbClass = priorityClasses[newPriority ?? task.priority ?? "none"];

    return (
        <div className={`flex items-center cursor-pointer ${ addPriority || newPriority || task.priority ? "min-w-[72px] mr-3" : "mr-1"}`}>
            {/* ----- Update Priority ----- */}
            {addPriority ? (
                <div className="flex items-center gap-1.5">
                    {Object.keys(priorityClasses).filter(priority => priority !=="none").map(priority => (
                        <div key={priority} className="relative group">
                            {/* ----- Orb ----- */}
                            <FaCircle
                                className={`h-3.5 w-3.5 rounded-full cursor-pointer transition-transform hover:scale-110 ${priorityClasses[priority]}`}
                                onClick={() => {
                                    if (!isNew) { handleUpdate({ newPriority: priority }); }
                                    setNewPriority(priority);
                                    setAddPriority(false);
                                }}
                            />
                            {/* ----- Tooltip ----- */}
                            <div className="absolute left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs capitalize opacity-0 rounded mt-2 py-1 px-2 
                                group-hover:opacity-100 transition-opacity"
                            >
                                {priority}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Priority Orb + Text
                <div className="flex items-center">
                    <div className="relative group mr-1">
                        {/* ----- Orb ----- */}
                        <FaCircle
                            className={`h-3.5 w-3.5 rounded-full ${orbClass}`}
                            onClick={() => setAddPriority(true)}
                        />
                        {/* ----- Tooltip -----*/}
                        <div
                            className={`absolute left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs capitalize opacity-0 rounded mt-2 py-1 px-2 
                                transition-opacity ${!newPriority && (task.priority ==null) ? "group-hover:opacity-100" : "opacity-0"}`}
                        >
                            Priority
                        </div>
                    </div> 
                    
                    {(isNew || (newPriority ?? task.priority)) && (
                        <div 
                            ref={wrapperRef}
                            className="flex relative group"
                        >
                            {/* ----- Text ----- */}
                            <span 
                                className="text-xs text-gray-400 capitalize"
                                onClick={() => {
                                    if (isTouchDevice) {
                                        setShowX(true);
                                        return;
                                    }
                                    setAddPriority(true);
                                }}
                            >
                                {newPriority ?? task.priority ?? (isNew ? "Priority" : "")}
                            </span>
                            {/* ----- Clear Priority ----- */}
                            <XMarkIcon
                                className={`h-3 w-3 text-gray-500 cursor-pointer opacity-0 transition-opacity
                                        ${newPriority ?? task.priority
                                            ? (isTouchDevice ? (showX ? "opacity-100" : "opacity-0")
                                            : "opacity-0 group-hover:opacity-100") : "opacity-0"}`}
                                onClick={() => {
                                    setNewPriority(null);
                                    setAddPriority(false);
                                    if (!isNew) handleUpdate({ newPriority: null });
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}