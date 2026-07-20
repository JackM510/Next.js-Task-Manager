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
    // Capitalise the first letter of Title input and span
    const capitalFirstLetter = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <div className="flex items-center">
            <div className="flex-1 min-w-0">
                {addTitle ? (
                    <input
                        value={newTitle}
                        placeholder="Enter a task"
                        autoFocus
                        onChange={(e) => setNewTitle(capitalFirstLetter(e.target.value))}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                isNew ? handleCreate() : handleUpdate({ newTitle: newTitle });
                            }
                        }}
                        className="
                            h-[30px] w-full block text-2xl text-gray-700 truncate
                            border-b-2 border-gray-300 py-0
                            focus:outline-none transition-colors duration-300"
                    />
                ) : (
                    <span
                        className={`h-[30px] w-full block text-2xl text-gray-700 truncate pb-[2px] cursor-pointer ${ task.completed ? "line-through" : ""}`}
                        onClick={() => {
                            if (!task.completed) {
                                setNewTitle(capitalFirstLetter(task.title!));
                                setAddTitle(true);
                            }
                        }}
                    >
                        {capitalFirstLetter(task.title!)}
                    </span>
                )}
            </div>

            {/* ----- Add/Update Title (Check) & Delete Task (Trash) ----- */}
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