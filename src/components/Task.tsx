"use client"; // Run in the browser
import { useState } from "react";
import { TaskType } from "../types/task"
import { TrashIcon } from "@heroicons/react/24/outline";

type TaskProps = {
    task: TaskType;
    /*onToggle: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;*/
}

export default function Task({ task }: TaskProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftTitle, setDraftTitle] = useState(task.title);
    const priorityClasses = {
        high: "bg-red-500 text-white",
        medium: "bg-orange-500 text-white",
        low: "bg-yellow-500 text-white"
    }

    return (
        <div className="flex p-4 bg-blue-100 border rounded mb-2">

            {/* Left side: checkbox + text column */}
            <div className="flex items-baseline gap-2">
                {/* Checkbox */}
                <input
                    type="checkbox"
                    
                    checked={task.completed}
                    onChange={() => alert(":)")}
                />

                {/* Title + priority */}
                <div className="flex flex-col">
                    {isEditing ? (
                    <input
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onBlur={() => setIsEditing(false)}
                        className="
                            text-lg leading-6 text-gray-700
                            border-b border-gray-300
                            focus:outline-none transition-colors duration-300
                        "
                    />
                    ) : (
                    <span
                        className="text-lg leading-6 text-black cursor-pointer pb-[1px]"
                        onClick={() => setIsEditing(true)}
                    >
                        {task.title}
                    </span>
                    )}

                    <span
                        className={`text-xs font-semibold uppercase mt-2 px-2 py-1 rounded-full w-fit hover:opacity-80 ${priorityClasses[task.priority]}`}
                    >
                        {task.priority}
                    </span>
                </div>
            </div>

            {/* Right side: delete button */}
            <div className="flex items-baseline justify-conten">
                <TrashIcon className="h-5 w-5 text-gray-700 hover:opacity-80"/>
            </div>
        </div>
    );
}