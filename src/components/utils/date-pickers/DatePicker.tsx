"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DAYS_SHORT, MONTHS_FULL } from "@/config/constants";

type DatePickerSize = "sm" | "md" | "lg";

interface DatePickerProps {
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  size?: DatePickerSize;
  clearable?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const sizeStyles: Record<DatePickerSize, string> = {
  sm: "ps-9 pe-3 py-1.5 text-sm",
  md: "ps-9 pe-3 py-2.5 text-sm",
  lg: "ps-10 pe-4 py-3 text-base",
};

const iconSizes: Record<DatePickerSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDisplay(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DatePicker({
  value = null,
  onChange,
  label,
  placeholder = "Select date",
  error,
  size = "md",
  clearable = true,
  disabled = false,
  fullWidth = false,
}: DatePickerProps) {
  const generatedId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const today = new Date();

  // Track the currently viewed year/month in a single state object
  const [view, setView] = useState(() => {
    const base = value ?? new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  const viewYear = view.year;
  const viewMonth = view.month;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function prevMonth() {
    setView((v) => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { year: v.year, month: v.month - 1 };
    });
  }

  function nextMonth() {
    setView((v) => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { year: v.year, month: v.month + 1 };
    });
  }

  function selectDate(year: number, month: number, day: number) {
    onChange?.(new Date(year, month, day));
    setView({ year, month });
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange?.(null);
  }

  // Build calendar grid
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonthYear = viewMonth === 0 ? viewYear - 1 : viewYear;
  const prevMonthIndex = viewMonth === 0 ? 11 : viewMonth - 1;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonthIndex);

  const nextMonthYear = viewMonth === 11 ? viewYear + 1 : viewYear;
  const nextMonthIndex = viewMonth === 11 ? 0 : viewMonth + 1;

  const cells: { day: number; month: number; year: number; current: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, month: prevMonthIndex, year: prevMonthYear, current: false });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: viewMonth, year: viewYear, current: true });
  }
  // Next month leading days (fill to 42 = 6 rows)
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, month: nextMonthIndex, year: nextMonthYear, current: false });
  }

  const inputClasses = [
    "block w-full rounded-lg border bg-gray-50 text-gray-900 shadow-sm transition-colors duration-150 select-none",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    "dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400",
    error ? "border-red-500 focus:ring-red-500" : "border-gray-300 hover:border-gray-400 dark:border-gray-600",
    sizeStyles[size],
    disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer",
    clearable && value ? "pe-9" : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-col gap-1 ${fullWidth ? "w-full" : "max-w-sm w-full"}`}
    >
      {label && (
        <label
          htmlFor={generatedId}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className={`${iconSizes[size]} text-gray-500 dark:text-gray-400`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
            />
          </svg>
        </div>

        <button
          id={generatedId}
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={`${inputClasses} text-left`}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
            {value ? (
            <span>{formatDisplay(value)}</span>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>
          )}
        </button>

        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
            aria-label="Clear date"
            tabIndex={-1}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-full w-full">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-600 dark:bg-gray-800">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 cursor-pointer"
              aria-label="Previous month"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {MONTHS_FULL[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 cursor-pointer"
              aria-label="Next month"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {DAYS_SHORT.map((d) => (
              <div key={d} className="py-1.5">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 text-center text-sm">
            {cells.map((cell, i) => {
              const cellDate = new Date(cell.year, cell.month, cell.day);
              const isSelected = value ? sameDay(cellDate, value) : false;
              const isToday = sameDay(cellDate, today);

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectDate(cell.year, cell.month, cell.day)}
                  className={[
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer",
                    isSelected
                      ? "bg-blue-600 text-white font-semibold"
                      : isToday
                        ? "bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900 dark:text-blue-300"
                        : cell.current
                          ? "text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                          : "text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700",
                  ].join(" ")}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <span
          id={`${generatedId}-error`}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}
