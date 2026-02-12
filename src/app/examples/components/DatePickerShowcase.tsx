"use client";

import { useState } from "react";
import DatePicker from "@/components/utils/date-pickers/DatePicker";

export default function DatePickerShowcase() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <DatePicker
        label="Pick a date"
        placeholder="Select date"
        value={date}
        onChange={setDate}
      />

      {date && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Selected:{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {date?.toLocaleDateString()}
          </span>
        </p>
      )}
    </div>
  );
}
