"use client"; // Run in the browser
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TaskType } from "../types/task"
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";

type TaskProps = {
    task: TaskType;
    isNew?: boolean;
    /*onToggle: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;*/
}

export default function Task({ task, isNew }: TaskProps) {

    const router = useRouter();
    const [isEditing, setIsEditing] = useState(isNew || false);
    const [draftTitle, setDraftTitle] = useState(task.title);
    const priorityClasses = {
        high: "bg-red-500 text-white",
        medium: "bg-orange-500 text-white",
        low: "bg-yellow-500 text-white"
    }

    // Create new task
    async function handleCreate() {
        const res = await fetch("/api", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title: draftTitle,
                completed: false,
                priority: null
            })
        });
        if (!res.ok) console.error("Failed to create task");
        isNew = false;
        router.refresh(); // Refresh task list after saving
    }

    // Update existing task
    async function handleUpdate() {
        const res = await fetch (`/api/$task._id}`, {
            method: "PATCH",
            headers: {"Content-Type": "applicaiton/JSON"},
            body: JSON.stringify({ title: draftTitle })
        });
        if (!res.ok) console.error("Failed to update task");
        setIsEditing(false);
        router.refresh(); // Refresh task list after saving
    }

    return (
        <div className="flex justify-between p-4 bg-gray-100 border rounded mb-2">
            {/* Left side: checkbox + text column */}
            <div className="flex flex-1 items-baseline">
                {/* Checkbox */}
                <input
                    type="checkbox"
                    className="mr-4"
                    checked={task.completed}
                    onChange={() => alert(":)")}
                />

                {/* Title + priority */}
                <div className="flex flex-1 flex-col">
                    {isEditing ? (
                    <input
                        value={draftTitle}
                        placeholder="Enter a task"
                        autoFocus={isNew}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onBlur={() => {
                            if (!isNew) {
                                setIsEditing(false);
                                setDraftTitle(task.title);
                            }
                            }}

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
            <div className="flex items-baseline ml-4">
                {isNew || isEditing ? (
                    <CheckIcon 
                        className="h-5 w-5 text-green-500 hover:opacity-80"
                        onClick={() => isNew ? handleCreate() : handleUpdate() }
                    />
                ) : (
                    <TrashIcon 
                        className="h-5 w-5 text-gray-700 hover:opacity-80"
                    />
                )}
            </div>
        </div>
    );
}