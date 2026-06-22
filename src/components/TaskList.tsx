"use client";
import Task from "./Task"
import { TaskType } from "../types/task"

type taskListProps= {
    tasks: TaskType[]
}

export default function TaskList({ tasks }: taskListProps ) {
    return (
        <div className="w-1/2 mx-auto p-12">
            {/* Heading */}
            <div className="border-b-3 border-gray-300 mb-4">
                <h1 className="text-5xl font-bold text-black pb-4">
                    Task Manager
                </h1>
            </div>
            {/* List of Tasks */}
            <div>
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