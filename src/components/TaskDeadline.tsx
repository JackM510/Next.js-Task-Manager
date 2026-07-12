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
      return !!value && new Date(value) < new Date() ? true : false;
    }
 
    return (
        <div className="flex items-center gap-1">
            <div className="relative group">
                {/* ----- Clock ----- */}
                <ClockIcon
                    className={`h-4 w-4 text-gray-400 cursor-pointer ${(isOverdue(newDeadline ?? null) || isOverdue(task.deadline ?? null)) ? "text-red-600" : "text-gray-400"}`}
                    onClick={() => {
                        datePickerRef.current?.setOpen(true);
                    }}
                />
                {/* No Deadline tooltip */}
                <div
                    className={`capitalize absolute left-1/2 -translate-x-1/2 opacity-0 mt-2 py-1 px-2 
                                transition-opacity bg-gray-800 text-white text-xs rounded
                                ${isNew || (!newDeadline && !task.deadline) ? "group-hover:opacity-100" : "opacity-0"}`}
                >
                    Deadline
                </div>
                
            </div>
            {/* ----- Add/Update Deadline ----- */}
            <div className="flex relative group max-w-max">
                <DatePicker
                    ref={datePickerRef}
                    selected={newDeadline ? new Date(newDeadline) : null}
                    onChange={(date: Date | null) => {
                        if (!date) return;
                        const iso = date;
                        if (!isNew) handleUpdate({ newDeadline: iso });
                        setNewDeadline(iso);
                    }}
                    customInput={
                        <DeadlineInput
                            ref={inputRef}
                            isNew={isNew}
                            deadline={newDeadline}
                            isOverdue={isOverdue}
                        />
                    }
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm aa"
                    minDate={new Date()}
                    popperClassName="z-50"
                    portalId="root-portal"
                    onKeyDown={(e) => e.preventDefault()}
                    onFocus={(e) => e.target.blur()}
                />
                {(newDeadline || task.deadline) && (
                    <XMarkIcon
                        className="text-gray-500 h-3 w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                            setNewDeadline(null);
                            if (!isNew) handleUpdate({ newDeadline: null });
                        }}
                    />
                )}
            </div>
        </div>
    )
}