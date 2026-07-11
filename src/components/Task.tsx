"use client"; // Run in the browser
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskType } from "../types/task"
import { CheckIcon, TrashIcon} from "@heroicons/react/24/outline";

import TaskDeadline from "./TaskDeadline"


type TaskProps = {
    task: TaskType;
    isNew: boolean;
    onFinishAdd?: () => void;
}

export default function Task({ task, isNew, onFinishAdd }: TaskProps) {
    const router = useRouter();
    // Title
    const [isEditing, setIsEditing] = useState(isNew || false);
    const [draftTitle, setDraftTitle] = useState(task.title ?? "");
    // Deadline
    const [newDeadline, setNewDeadline] = useState<Date | null>(task.deadline ? new Date(task.deadline) : null);
    // Priority
    const [addPriority, setAddPriority] = useState(false);
    const [draftPriority, setDraftPriority] = useState<string | null>(task.priority ?? null);
    const priorityClasses: Record<string, string> = {
        none: "bg-gray-400 text-white",
        low: "bg-emerald-400 text-white",
        medium: "bg-amber-400 text-white",
        high: "bg-rose-600 text-white"
    }
   
    // Task container outside click event
    const taskContainer = useRef<HTMLDivElement>(null); // task container ref
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if ((e.target as HTMLElement).closest(".react-datepicker")) return;
            if (taskContainer.current && !taskContainer.current.contains(e.target as Node)) {
                setIsEditing(false); // stop editing
                onFinishAdd?.(); // stop adding
                setAddPriority(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ----- Create task ----- */
    async function handleCreate() {
        if (!draftTitle.trim()) return;
        const res = await fetch("/api", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title: draftTitle,
                priority: draftPriority,
                deadline: newDeadline,
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
        newDeadline,
        isCompleted
    }: {
        newPriority?: string | null;
        newDeadline?: Date | null;
        isCompleted?: boolean;
    } = {}) {
        if (!draftTitle.trim()) return;
        const res = await fetch(`/api/tasks/${task._id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ 
                title: draftTitle,
                priority: newPriority !==undefined ? newPriority : draftPriority,
                deadline: newDeadline !==undefined ? newDeadline: newDeadline,
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
            className={`flex justify-between p-4 border-2 rounded mb-3 bg-gray-100 
                transform transition-transform duration-250 hover:-translate-y-0.5 
                ${task.completed ? "opacity-75" : ""}`}
        >
            {/* ----- CHECKBOX + TITLE + METADATA */}
            <div className="flex flex-1 items-baseline">
                {/* ----- Checkbox ----- */}
                <input
                    type="checkbox"
                    className="mr-4 accent-blue-500"
                    checked={task.completed}
                    onChange={() => {
                        handleUpdate({isCompleted: !task.completed});
                    }}
                />
                {/* ----- TASK TITLE ----- */}
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
                            text-2xl leading-6 text-gray-700
                            border-b-2 border-gray-300 my-1
                            focus:outline-none transition-colors duration-300"
                    />
                    ) : (
                    <span
                        className={`text-2xl my-1 leading-6 text-slate-700 cursor-pointer pb-1 inline-block overflow-hidden ${ task.completed ? "line-through" : ""}`}
                        onClick={() => {
                            if (!task.completed) setIsEditing(true);
                        }}
                    >
                        {task.title}
                    </span>
                    )}

                    {/* ----- Task Metadata ----- */}
                    {!task.completed && (
                        <div className="flex">
                            {/* ----- Priority ----- */}
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
                                                        setDraftPriority(value);
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
                                                className={`h-3 w-3 rounded-full ${
                                                    priorityClasses[draftPriority ?? task.priority ?? "none"]
                                                }`}  
                                            />
                                            {/* No Priority tooltip */}
                                            {(!draftPriority && !task.priority) && (
                                                <div
                                                    className="capitalize absolute left-1/2 -translate-x-1/2 opacity-0 mt-2 py-1 px-2 
                                                        group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded"
                                                >
                                                    Priority
                                                </div>
                                            )}
                                        </div>
                                        {/* Priority text */}
                                        {(isNew || (draftPriority ?? task.priority)) && (
                                            <span className="text-xs font-semibold capitalize text-gray-400">
                                                {(draftPriority ?? task.priority ?? (isNew ? "Priority" : "")) && 
                                                `${draftPriority ?? task.priority ?? ""} priority`}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                                
                            {/* ----- Time ----- */}
                            <TaskDeadline
                                task={task}
                                isNew={isNew}
                                newDeadline={newDeadline}
                                setNewDeadline={setNewDeadline}
                                handleUpdate={handleUpdate}
                            />
                    </div>
                    )}

                </div>
            </div>
            {/* ----- Delete Task ----- */}
            <div className="flex items-baseline ml-4">
                {isNew || isEditing ? (
                    <CheckIcon 
                        className="h-5 w-5 text-green-500 hover:scale-110 hover:opacity-80"
                        onClick={() => isNew ? handleCreate() : handleUpdate() }
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