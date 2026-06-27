"use client"; // Run in the browser
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskType } from "../types/task"
import { PlusIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";

type TaskProps = {
    task: TaskType;
    isNew?: boolean;
    onFinishAdd?: () => void;
}

export default function Task({ task, isNew, onFinishAdd }: TaskProps) {

    const router = useRouter();
    const [isEditing, setIsEditing] = useState(isNew || false);
    const [draftTitle, setDraftTitle] = useState(task.title ?? "");
    const [addPriority, setAddPriority] = useState(false);
    const [draftPriority, setDraftPriority] = useState<string | null>(task.priority ?? null);
    const priorityClasses: Record<string, string> = {
        none: "bg-gray-300 text-white",
        low: "bg-yellow-500 text-white",
        medium: "bg-orange-500 text-white",
        high: "bg-red-500 text-white"
    }

    // Task container outside click event
    const taskContainer = useRef<HTMLDivElement>(null); // task container ref
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (isEditing && taskContainer.current && !taskContainer.current.contains(e.target as Node)) {
                setIsEditing(false); // stop editing
                onFinishAdd?.(); // stop adding
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isEditing], );

    /* ----- Create task ----- */
    async function handleCreate() {
        if (!draftTitle.trim()) return;
        const res = await fetch("/api", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title: draftTitle,
                priority: draftPriority,
                completed: false
            })
        });
        if (!res.ok) console.error("Failed to create task");
        router.refresh(); // Refresh task list after saving
        onFinishAdd?.();   // Call the passed function
    }

    /* ----- Update task ----- */
    async function handleUpdate({
        newPriority,
        isCompleted
    }: {
        newPriority?: string | null;
        isCompleted?: boolean;
    } = {}) {
        if (!draftTitle.trim()) return;
        const res = await fetch(`/api/tasks/${task._id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ 
                title: draftTitle,
                priority: newPriority !==undefined ? newPriority : draftPriority,
                completed: isCompleted ?? false
            })
        });
        if (!res.ok) console.error("Failed to update task");
        router.refresh(); // Refresh task list after saving
        setIsEditing(false);
    }

    /* ----- Delete task ----- */
    async function handleDelete() {
        const res = await fetch(`/api/tasks/${task._id}`, {
            method: "DELETE",
        });
        if (!res.ok) console.error("Failed to delete task");
        router.refresh();
    }

    return (
        <div 
            ref={taskContainer}
            className={`flex justify-between p-4 bg-gray-100 border rounded mb-2 ${ task.completed ? "opacity-50" : ""}`}
        >
            {/* Left side: checkbox + text column */}
            <div className="flex flex-1 items-baseline">
                {/* Checkbox */}
                <input
                    type="checkbox"
                    className="mr-4"
                    checked={task.completed}
                    onChange={() => {
                        setDraftPriority(null);
                        handleUpdate({newPriority: null, isCompleted: !task.completed}); // update completed to true
                    }}
                />

                {/* Title + priority */}
                <div className="flex flex-1 flex-col">
                    {isEditing ? (
                    <input
                        value={draftTitle}
                        placeholder="Enter a task"
                        autoFocus={isEditing}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                isNew ? handleCreate() : handleUpdate();
                            }
                        }}
                        className="
                            text-lg leading-6 text-gray-700
                            border-b-2 border-gray-300
                            focus:outline-none transition-colors duration-300"
                    />
                    ) : (
                    <span
                        className={`text-lg leading-6 text-black cursor-pointer pb-[1px]  ${ task.completed ? "line-through" : ""}`}
                        onClick={() => {
                            if (!task.completed) setIsEditing(true);
                        }}
                    >
                        {task.title}
                    </span>
                    )}

                    {/* Add/Update Task Priority */}
                    {addPriority ? (
                        <div className="mt-2">
                            {Object.keys(priorityClasses)
                                .filter(key => key !== "none")
                                .map(priority => (
                                <span
                                    key={priority}
                                    className={`text-xs font-semibold uppercase mr-1 px-2 py-1 rounded-full w-fit hover:opacity-80 ${priorityClasses[priority]}`}
                                    onClick={() => {
                                        if (!isNew) {
                                            handleUpdate({newPriority: priority}); 
                                        } 
                                        setDraftPriority(priority);
                                        setAddPriority(false); // hide add priority UI
                                    }}
                                >
                                    {priority}
                                </span>
                            ))}
                        </div>
                    ) : ( !task.completed && (
                        <span
                        className={`text-xs font-semibold uppercase mt-2 px-2 py-1 rounded-full w-fit hover:opacity-80 
                            ${ draftPriority ? priorityClasses[draftPriority] : task.priority ? priorityClasses[task.priority] : priorityClasses["none"]}`}
                        onClick={() => setAddPriority(true)}
                        >
                            { draftPriority ? `Priority: ${draftPriority}`  : task.priority ? `Priority: ${task.priority}` : "PRIORITY" }
                        </span>)
                    )}
                </div>
            </div>
            {/* Right side: delete button */}
            <div className="flex items-baseline ml-4">
                {isNew || isEditing ? (
                    <CheckIcon 
                        className="h-5 w-5 text-green-500 hover:scale-110 hover:opacity-80"
                        onClick={() => isNew ? handleCreate() : handleUpdate() }
                    />
                ) : (
                    <TrashIcon 
                        className="h-5 w-5 text-gray-700 hover:scale-110 hover:opacity-80"
                        onClick={() => handleDelete()}
                    />
                )}
            </div>
        </div>
    );
}