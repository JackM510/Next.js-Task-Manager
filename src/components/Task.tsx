"use client"; // Run in the browser
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskType } from "../types/task"
import TaskTitle from "./TaskTitle";
import TaskPriority from "./TaskPriority"
import TaskDeadline from "./TaskDeadline"

type TaskProps = {
    task: TaskType;
    isNew: boolean;
    onFinishAdd?: () => void;
}

export default function Task({ task, isNew, onFinishAdd }: TaskProps) {
    const router = useRouter();
    // Title, Deadline, Priority
    const [addTitle, setAddTitle] = useState(isNew || false);
    const [newTitle, setNewTitle] = useState(task.title ?? "");
    const [newDeadline, setNewDeadline] = useState<Date | null>(task.deadline ?? null);
    const [addPriority, setAddPriority] = useState(false);
    const [newPriority, setNewPriority] = useState<string | null>(task.priority ?? null);

    // Task container outside click
    const taskContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if ((e.target as HTMLElement).closest(".react-datepicker")) return;
            if (taskContainer.current && !taskContainer.current.contains(e.target as Node)) {
                setAddTitle(false);
                onFinishAdd?.();
                setAddPriority(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ----- Create task ----- */
    async function handleCreate() {
        if (!newTitle.trim()) return;
        const res = await fetch("/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newTitle,
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
        if ("newTitle" in update && update.newTitle?.trim()) { body.title = update.newTitle.trim(); }
        if ("newPriority" in update) { body.priority = update.newPriority; }
        if ("newDeadline" in update) { body.deadline = update.newDeadline; }
        if ("isCompleted" in update) { body.completed = update.isCompleted; }
        // Fetch API
        const res = await fetch(`/api/tasks/${task._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        router.refresh(); // Refresh task list after saving
        setAddTitle(false);
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
            className={`flex flex-1 items-baseline min-w-0 p-4 border-2 rounded mb-3 bg-gray-100
                transform transition-transform duration-250 hover:-translate-y-0.5 
                ${task.completed ? "opacity-75" : ""}`}
        >

            {/* ----- Checkbox ----- */}
            <input
                type="checkbox"
                className="mr-4 accent-blue-500"
                checked={task.completed}
                onChange={() => {
                    handleUpdate({ isCompleted: !task.completed });
                }}
            />
            <div className="flex flex-col w-full min-w-0">
                {/* ----- Title ----- */}
                <TaskTitle
                    task={task}
                    isNew={isNew}
                    addTitle={addTitle}
                    setAddTitle={setAddTitle}
                    newTitle={newTitle}
                    setNewTitle={setNewTitle}
                    handleCreate={handleCreate}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                />
                {/* ----- Metadata ----- */}
                {!task.completed && (
                    <div className="flex mt-2">
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
                        {/* ----- Deadline ----- */}
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
    );
}