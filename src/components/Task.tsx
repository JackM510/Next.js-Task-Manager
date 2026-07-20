"use client"; // Run in browser
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskType } from "../types/task"
import TaskTitle from "./TaskTitle";
import TaskPriority from "./TaskPriority"
import TaskDeadline from "./TaskDeadline"
import { motion } from "framer-motion";

type TaskProps = {
    task: TaskType;
    isNew: boolean;
    setIsAdding?: (value: boolean) => void;
}

export default function Task({ task, isNew, setIsAdding }: TaskProps) {
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
                setAddPriority(false);
                setIsAdding?.(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ----- Create task ----- */
    async function handleCreate() {
        if (!newTitle.trim()) return;
        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newTitle,
                priority: newPriority,
                deadline: newDeadline,
                completed: false,
                createdAt: new Date(),
                finishedAt: null
            })
        });
        if (!res.ok) console.error("Failed to create task");
        router.refresh(); // Refresh task list
        setIsAdding?.(false);
        setAddTitle(false);
        setAddPriority(false);
    }

    /* ----- Update task ----- */
    async function handleUpdate(update: {
        newTitle?: string;
        newPriority?: string | null;
        newDeadline?: Date | null;
        isCompleted?: boolean;
        finishedAt?: Date | null;
    } = {}) {
        // Only send fields that were provided
        const body: any = {};
        if ("newTitle" in update && update.newTitle?.trim()) { body.title = update.newTitle.trim(); }
        if ("newPriority" in update) { body.priority = update.newPriority; }
        if ("newDeadline" in update) { body.deadline = update.newDeadline; }
        if ("isCompleted" in update) { body.completed = update.isCompleted; }
        if ("finishedAt" in update) { body.finishedAt = update.finishedAt; }
        // Fetch API
        const res = await fetch(`/api/tasks/${task._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!res.ok) console.error("Failed to update task");
        router.refresh(); // Refresh task list
        setAddTitle(false);
        setAddPriority(false);
    }

    /* ----- Delete task ----- */
    async function handleDelete() {
        const res = await fetch(`/api/tasks/${task._id}`, {
            method: "DELETE",
        });
        if (!res.ok) console.error("Failed to delete task");
        router.refresh(); // Refresh task list
    }

    return (
        <motion.div
            ref={taskContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: task.completed ? 0.75 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 items-baseline min-w-0 bg-gray-100 border-2 border-gray-200 rounded p-4 mb-3 transition-transform duration-250 hover:-translate-y-0.5"
        >
            {/* ----- Checkbox ----- */}
            <input
                type="checkbox"
                className="accent-blue-500 mr-4"
                checked={task.completed}
                onChange={() => {
                    const isTaskCompleted = !task.completed;
                    handleUpdate({
                        isCompleted: isTaskCompleted,
                        finishedAt: isTaskCompleted ? new Date() : null,
                        newPriority: null,
                        newDeadline: null
                    });
                    setNewPriority(null);
                    setNewDeadline(null);
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
                    <div className="flex flex-col sm:flex-row gap-y-2 mt-3">
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
        </motion.div>
    );
}