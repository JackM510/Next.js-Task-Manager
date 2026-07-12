import React from "react";

type DeadlineInputProps = {
  deadline: Date | null;
  onClick?: () => void;
  isNew: boolean;
  isOverdue: (value: Date | null) => boolean;
};

const DeadlineInput = React.forwardRef<HTMLSpanElement, DeadlineInputProps>(
  ({ deadline, onClick, isNew, isOverdue}, ref) => {
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
      <span
        ref={ref}
        onClick={onClick}
        className={`text-xs font-semibold cursor-pointer select-none ${isOverdue(deadline ?? null) ? "text-red-500" : "text-gray-400"}`}
      >
        {text}
      </span>
    );
  }
);
export default DeadlineInput;