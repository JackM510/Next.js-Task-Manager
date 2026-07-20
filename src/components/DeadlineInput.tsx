import React from "react";
import { TaskType } from "../types/task"
import { XMarkIcon } from "@heroicons/react/24/outline";

type DeadlineInputProps = {
  task: TaskType;
  onClick?: () => void;
  deadline: Date | null;
  setNewDeadline: (value: Date | null) => void;
  isNew: boolean;
  isOverdue: (value: Date | null) => boolean;
  handleUpdate: (args: {newDeadline?: Date | null}) => void;
};

const DeadlineInput = React.forwardRef<HTMLSpanElement, DeadlineInputProps>(
  ({ task, onClick, deadline, setNewDeadline, isNew, isOverdue, handleUpdate}, ref) => {
    // Format deadline function
    const formatDeadline = (deadline: Date) => {
      return deadline.toLocaleString("en-AU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace("am", "AM")
      .replace("pm", "PM");
    };
    // Deadline text
    const text = !!deadline ? formatDeadline(new Date(deadline)) : isNew ? "Deadline" : "";
    
    return (
      <div className="flex">
        <span
          ref={ref}
          onClick={onClick}
          className={`text-xs cursor-pointer ${isOverdue(deadline ?? null) ? "text-red-500" : "text-gray-400"}`}
        >
          {text}
        </span>
        {(deadline) && (
          <XMarkIcon
              className="h-3 w-3 text-gray-500 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                  e.stopPropagation();
                  setNewDeadline(null);
                  if (!isNew) handleUpdate({ newDeadline: null });
              }}
          />
        )}
      </div>
    );
  }
);
export default DeadlineInput;