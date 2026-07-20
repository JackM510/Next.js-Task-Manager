import { useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { TaskType } from "../types/task"
import DeadlineInput from "./DeadlineInput";

type TaskDeadlineProps = {
    task: TaskType;
    isNew: boolean;
    newDeadline: Date | null;
    setNewDeadline: (value: Date | null) => void;
    handleUpdate: (args: {newDeadline?: Date | null}) => void;
}

export default function TaskDeadline({task, isNew, newDeadline, setNewDeadline, handleUpdate}: TaskDeadlineProps) {
    const inputRef = useRef(null);
    const datePickerRef = useRef<DatePicker | null>(null);
    // Check if a deadline is overdue
    const isOverdue = (value: Date | null) => {
        return !!value && value < new Date();
    };

    return (
        <div className="flex items-center gap-1">
            <div className="relative group">
                {/* ----- Clock ----- */}
                <ClockIcon
                    className={`h-4 w-4 cursor-pointer ${(isOverdue(newDeadline ?? null) || isOverdue(task.deadline ?? null)) ? "text-red-600" : "text-gray-400"}`}
                    onClick={() => {
                        datePickerRef.current?.setOpen(true);
                    }}
                />
                {/* Tooltip */}
                <div
                    className={`absolute left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs capitalize rounded mt-2 py-1 px-2 
                                transition-opacity opacity-0 ${isNew || (!newDeadline && !task.deadline) ? "group-hover:opacity-100" : ""}`}
                >
                    Deadline
                </div>
            </div>
            {/* ----- Add/Update & Clear Deadline ----- */}
            <div className="flex relative group">
                <DatePicker
                    ref={datePickerRef}
                    selected={newDeadline}
                    onChange={(date: Date | null) => {
                        if (!date) return;
                        if (!isNew) handleUpdate({ newDeadline: date });
                        setNewDeadline(date);
                    }}
                    customInput={
                        <DeadlineInput
                            ref={inputRef}
                            task={task}
                            isNew={isNew}
                            deadline={newDeadline}
                            setNewDeadline={setNewDeadline}
                            isOverdue={isOverdue}
                            handleUpdate={handleUpdate}
                        />
                    }
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm aa"
                    minDate={new Date()}
                    popperPlacement="bottom-start"
                    popperClassName="z-50"
                    portalId="root-portal"
                    withPortal
                    onKeyDown={(e) => e.preventDefault()}
                />
            </div>
        </div>
    );
}