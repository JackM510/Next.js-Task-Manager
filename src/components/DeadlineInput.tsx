import React from "react";
import { useMobileRevealX } from "../hook/useMobileRevealX"
import { XMarkIcon } from "@heroicons/react/24/outline";

type DeadlineInputProps = {
  onClick?: () => void;
  deadline: Date | null;
  setNewDeadline: (value: Date | null) => void;
  isNew: boolean;
  isOverdue: (value: Date | null) => boolean;
  handleUpdate: (args: {newDeadline?: Date | null}) => void;
  isTouchDevice: boolean;
};

const DeadlineInput = React.forwardRef<HTMLSpanElement, DeadlineInputProps>(
  ({ onClick, deadline, setNewDeadline, isNew, isOverdue, handleUpdate, isTouchDevice}, ref) => {
    // Track whether X should be shown if on mobile through touch
    const { showX, setShowX, wrapperRef } = useMobileRevealX();
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
      <div
        ref={wrapperRef}
        className="flex relative group"
      >
        <span
          ref={ref}
          className={`text-xs cursor-pointer ${isOverdue(deadline ?? null) ? "text-red-500" : "text-gray-400"}`}
          onClick={() => {
            if (isTouchDevice) {
              setShowX(true);
              return;
            }
            onClick?.();
          }}
        >
          {text}
        </span>
        {(deadline) && (
          <XMarkIcon
              className={`h-3 w-3 text-gray-500 cursor-pointer opacity-0 transition-opacity ${isTouchDevice ? showX ? "opacity-100" : "opacity-0" : "group-hover:opacity-100"}`}
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