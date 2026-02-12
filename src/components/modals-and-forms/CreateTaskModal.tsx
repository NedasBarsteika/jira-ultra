"use client";

import { useState } from "react";
import * as yup from "yup";
import Modal from "@/components/utils/modals/Modal";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: TaskFormData) => void;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  assignee: string;
}

const taskSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  description: yup
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters"),
  priority: yup
    .string()
    .oneOf(["low", "medium", "high", "critical"], "Invalid priority")
    .required("Priority is required"),
  assignee: yup
    .string()
    .trim()
    .max(50, "Assignee must be at most 50 characters"),
});

type FieldErrors = Partial<Record<keyof TaskFormData, string>>;

const inputClasses =
  "block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400";

const inputErrorClasses =
  "block w-full rounded-lg border border-red-500 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white dark:border-red-500 dark:placeholder-gray-400";

const labelClasses =
  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

const emptyForm: TaskFormData = {
  title: "",
  description: "",
  priority: "medium",
  assignee: "",
};

export default function CreateTaskModal({
  open,
  onClose,
  onSubmit,
}: CreateTaskModalProps) {
  const [form, setForm] = useState<TaskFormData>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  function update(field: keyof TaskFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit() {
    try {
      const validated = await taskSchema.validate(form, { abortEarly: false });
      setErrors({});
      setLoading(true);
      // Simulate async submit
      setTimeout(() => {
        onSubmit?.(validated as TaskFormData);
        setLoading(false);
        setForm(emptyForm);
        onClose();
      }, 1000);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const fieldErrors: FieldErrors = {};
        for (const inner of err.inner) {
          if (inner.path && !fieldErrors[inner.path as keyof TaskFormData]) {
            fieldErrors[inner.path as keyof TaskFormData] = inner.message;
          }
        }
        setErrors(fieldErrors);
      }
    }
  }

  function handleClose() {
    setForm(emptyForm);
    setErrors({});
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create Task"
      submitLabel="Create"
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className={labelClasses}>
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={errors.title ? inputErrorClasses : inputClasses}
            placeholder="Enter task title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className={labelClasses}>Description</label>
          <textarea
            className={`${errors.description ? inputErrorClasses : inputClasses} resize-none`}
            rows={3}
            placeholder="Describe the task..."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description}
            </p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className={labelClasses}>Priority</label>
          <select
            className={`${errors.priority ? inputErrorClasses : inputClasses} cursor-pointer`}
            value={form.priority}
            onChange={(e) => update("priority", e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.priority}
            </p>
          )}
        </div>

        {/* Assignee */}
        <div>
          <label className={labelClasses}>Assignee</label>
          <input
            type="text"
            className={errors.assignee ? inputErrorClasses : inputClasses}
            placeholder="Assign to..."
            value={form.assignee}
            onChange={(e) => update("assignee", e.target.value)}
          />
          {errors.assignee && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.assignee}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
