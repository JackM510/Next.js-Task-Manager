"use client"; // Run in the browser
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskType } from "../types/task"
import { CheckIcon, TrashIcon} from "@heroicons/react/24/outline";

import TaskPriority from "./TaskPriority"
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
    const [newDeadline, setNewDeadline] = useState<Date | null>(task.deadline ?? null);
    // Priority
    const [addPriority, setAddPriority] = useState(false);
    const [newPriority, setNewPriority] = useState<string | null>(task.priority ?? null);
    
   
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
                priority: newPriority,
                deadline: newDeadline,
                completed: false
            })
        });
        if (!res.ok) console.error("Failed to create task");
        router.refresh(); // Refresh task list after saving
        onFinishAdd?.();   // Call the passed function
    }

    /* ----- Update task ----- */
    async function handleUpdate(update: {
        newTitle?: string;
        newPriority?: string | null;
        newDeadline?: Date | null;
        isCompleted?: boolean;       
    } = {}) {
        // Only send fields that were provided in the function signature
        const body: any = {};
        if ("newTitle" in update && update.newTitle?.trim()) {body.title = update.newTitle.trim();}
        if ("newPriority" in update) {body.priority = update.newPriority;}
        if ("newDeadline" in update) {body.deadline = update.newDeadline;}
        if ("isCompleted" in update) {body.completed = update.isCompleted;}
        // Fetch API
        const res = await fetch(`/api/tasks/${task._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
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
                                isNew ? handleCreate() : handleUpdate({ newTitle: draftTitle });
                            }
                        }}
                        className="
                            text-2xl leading-6 text-gray-700
                            border-b-2 border-gray-300
                            focus:outline-none transition-colors duration-300"
                    />
                    ) : (
                    <span
                        className={`text-2xl leading-6 text-slate-700 cursor-pointer pb-1 inline-block overflow-hidden ${ task.completed ? "line-through" : ""}`}
                        onClick={() => {
                            if (!task.completed) setIsEditing(true);
                        }}
                    >
                        {task.title}
                    </span>
                    )}

                    {/* ----- Task Metadata ----- */}
                    {!task.completed && (
                        <div className="flex mt-1">
                            {/* ----- Priority ----- */}
                            <TaskPriority 
                                task={task}
                                isNew={isNew}
                                addPriority={addPriority}
                                setAddPriority={setAddPriority}
                                newPriority={newPriority}
                                setNewPriority={setNewPriority}
                                handleUpdate={handleUpdate}
                            />
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
            {/* ----- Add / Delete Task ----- */}
            <div className="flex items-baseline ml-4">
                {isNew || isEditing ? (
                    <CheckIcon 
                        className="h-5 w-5 text-green-500 hover:scale-110 hover:opacity-80"
                        onClick={() => isNew ? handleCreate() : handleUpdate({newTitle: draftTitle}) }
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