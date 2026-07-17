import { TaskType } from "@/types/task";
import { CheckIcon, TrashIcon} from "@heroicons/react/24/outline";
type TaskTitleProps = {
    task: TaskType
    isNew: boolean;
    addTitle: boolean;
    setAddTitle: (value: boolean) => void;
    newTitle: string;
    setNewTitle: (value: string) => void;
    handleCreate: () => void;
    handleUpdate: (update: {newTitle: string}) => void;
    handleDelete: () => void;
}

export default function TaskTitle({task, isNew, addTitle, setAddTitle, newTitle, setNewTitle, handleCreate, handleUpdate, handleDelete}: TaskTitleProps){



    return (
        <div className="flex items-center">
            {addTitle ? (
                <input
                    id="title-input"
                    value={newTitle}
                    placeholder="Enter a task"
                    autoFocus={addTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            isNew ? handleCreate() : handleUpdate({ newTitle: newTitle });
                        }
                    }}
                    className="
                        h-[30px] flex-1 block text-2xl text-gray-700
                        border-b-2 border-gray-300 py-0 align-middle
                        focus:outline-none transition-colors duration-300"
                />
                ) : (
                <span
                    className={`h-[30px] flex-1 truncate pb-[2px] text-2xl text-slate-700 cursor-pointer ${ task.completed ? "line-through" : ""}`}
                    onClick={() => {
                        if (!task.completed) setAddTitle(true);
                    }}
                >
                    {task.title}
                </span>
            )}

            {/* ----- Add/Update Title & Delete Task ----- */}
            <div className="flex items-baseline ml-4">
                {isNew || addTitle ? (
                    <CheckIcon 
                        className="h-5 w-5 text-green-500 hover:scale-110 hover:opacity-80"
                        onClick={() => isNew ? handleCreate() : handleUpdate({newTitle: newTitle}) }
                    />
                ) : (
                    <TrashIcon 
                        className="h-5 w-5 text-gray-400 hover:scale-110 hover:opacity-80"
                        onClick={() => handleDelete()}
                    />
                )}
            </div>
        </div>
    );
}