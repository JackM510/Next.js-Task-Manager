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

    return (
        <div className="w-1/2 mx-auto p-12">
            {/* Heading */}
            <div className="flex items-baseline justify-between border-b-3 border-gray-300 mb-4">
                <h1 className="text-4xl font-bold text-black pb-4">
                    Task Manager
                </h1>
                <PlusIcon 
                    className="h-5 w-5 text-black hover:opacity-80 hover:scale-125"
                    onClick={() => setIsAdding(true)}
                />
            </div>
            {/* Tasks */}
            <div>
                {/* Add Task */}
                {isAdding && (
                    <Task
                        task={{
                            _id: "new-task",
                            completed: false,
                        }}
                        isNew={true}
                        onFinishAdd={() => setIsAdding(false)}
                    />
                )}



                {/* All Tasks */}
                {tasks.map((task) => (
                    < Task
                        key={task._id}
                        task={task}
                        
                    />
                )

                )}
            </div>
        </div>
    );
}