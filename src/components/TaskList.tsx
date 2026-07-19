"use client";
import { useState } from "react";
import Task from "./Task"
import { TaskType } from "../types/task"
import { PlusIcon } from "@heroicons/react/24/outline";

type taskListProps= {
    tasks: TaskType[]
}

export default function TaskList({ tasks }: taskListProps ) {
    const [isAdding, setIsAdding] = useState(false);
    const [sortMode, setSortMode] = useState("creation");
    const sortedTasks =
        sortMode === "creation"
            ? sortByCreation(tasks)
            : sortMode === "deadline"
            ? sortByDeadline(tasks)
            : sortMode === "priority"
            ? sortByPriority(tasks)
            : tasks;

    // Sort by creation date
    function sortByCreation(tasks: TaskType[]) {
        return [...tasks].sort((task1, task2) => {
            // 1. Determine which tasks are active/completed
            const completionOrder = checkTaskCompleted(task1, task2);
            if (completionOrder !== 0) return completionOrder;
            // 2. If both tasks are active - sort by createdAt date
            if (!task1.completed && !task2.completed) {
                const t1 = new Date(task1.createdAt).getTime();
                const t2 = new Date(task2.createdAt).getTime();
                return t1 - t2;
            }
            // 3. If both tasks are completed sort by finishedAt
            return sortByFinishedAt(task1, task2);
        });
    }

    // Sort by deadline date
    function sortByDeadline(tasks: TaskType[]) {
        return [...tasks].sort((task1, task2) => {
            // 1. Determine which tasks are active/completed
            const completionOrder = checkTaskCompleted(task1, task2);
            if (completionOrder !== 0) return completionOrder;
            // 2. If both tasks are active, sort by deadline
            if (!task1.completed && !task2.completed) {
                if (!task1.deadline && !task2.deadline) return 0; // If Both tasks have no deadline - their position is equal
                if (!task1.deadline) return 1;  // If task1 has no deadline - position under task2
                if (!task2.deadline) return -1; // If task2 has no deadline - position under task1
                // If both tasks have a deadline - convert deadlines to timestamps
                const d1 = new Date(task1.deadline).getTime();
                const d2 = new Date(task2.deadline).getTime();
                // The earliest deadline (lowest number) comes first
                return d1 - d2;
            }
            // 3. If both tasks are completed sort by finishedAt
            return sortByFinishedAt(task1, task2);
        });
    }

    // Sort by task priority
    function sortByPriority(tasks: TaskType[]) {
        // Rank the order of each priority string
        const priorityRank = {
            high: 1,
            medium: 2,
            low: 3,
            none: 4
        };
        return [...tasks].sort((task1, task2) => {
            // 1. Determine which tasks are active/completed
            const completionOrder = checkTaskCompleted(task1, task2);
            if (completionOrder !== 0) return completionOrder;
            // 2. If both tasks are active, sort by priority
            if (!task1.completed && !task2.completed) {
                // Convert priority into a numeric rank (high → low)
                const p1 = priorityRank[task1.priority ?? "none"];
                const p2 = priorityRank[task2.priority ?? "none"];
                // The lowest number has the highest priority and is positioned first
                return p1 - p2;
            }
            // 3. If both tasks are completed sort by finishedAt
            return sortByFinishedAt(task1, task2);
        });
    }

    // Check if a task is active or completed
    // Return '1' if completed, '-1' if active, '0' if both tasks have the same state
    // These values are used to change the order of the list
    function checkTaskCompleted(task1: TaskType, task2: TaskType) {
        if (task1.completed !== task2.completed) {
            return task1.completed ? 1 : -1;
        }
        return 0;
    }

    // Sort completed tasks by finishedAt date
    // If return is a positive number, task1 is positioned after task2
    // If return is a negative number, task1 is positioned before task2
    function sortByFinishedAt(task1: TaskType, task2: TaskType) {
        const t1 = new Date(task1.finishedAt!).getTime();
        const t2 = new Date(task2.finishedAt!).getTime();
        return t1 - t2;
    }

    return (
        <div className="min-h-screen sm:w-3/4 lg:w-3/5 xl:w-1/2 mx-auto py-12">
            {/* ----- Task Manager header ----- */}
            <div className="flex items-baseline justify-between border-b-3 border-gray-300 mb-4">
                <h1 className="text-4xl font-bold text-black pb-4">
                    Task Manager
                </h1>
                <PlusIcon
                    className="h-5 w-5 text-black hover:opacity-80 hover:scale-125"
                    onClick={() => setIsAdding(true)}
                />
            </div>
            {/* ----- Sort by ----- */}
            <div className="flex">
                <select
                    className="text-black mb-4"
                    onChange={(e) => { setSortMode(e.target.value) }}
                >
                    <option value="creation">Creation (default)</option>
                    <option value="deadline">Deadline (soonest first)</option>
                    <option value="priority">Priority (high → low)</option>
                </select>
            </div>
            {/* ----- Tasks ----- */}
            <div>
                {/* Add a Task */}
                {isAdding && (
                    <Task
                        task={{
                            _id: "new-task",
                            completed: false,
                            createdAt: new Date()
                        }}
                        isNew={true}
                        onFinishAdd={() => setIsAdding(false)}
                    />
                )}
                {/* All Tasks */}
                {sortedTasks.map((task) => (
                    < Task
                        key={task._id}
                        task={task}
                        isNew={false}
                    />
                ))}
            </div>
        </div>
    );
}