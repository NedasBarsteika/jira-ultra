"use client";

import { useState } from "react";
import CustomButton from "@/components/utils/buttons/CustomButton";

export default function ButtonShowcase() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const simulateLoading = (id: string) => {
    setLoadingId(id);
    setTimeout(() => setLoadingId(null), 2000);
  };

  const starIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path
        fillRule="evenodd"
        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
        clipRule="evenodd"
      />
    </svg>
  );

  const arrowIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Colors - Solid */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Colors (Solid)</h2>
        <div className="flex flex-wrap gap-3">
          <CustomButton
            color="primary"
            onClick={() => alert("Primary clicked")}
          >
            Primary
          </CustomButton>
          <CustomButton
            color="secondary"
            onClick={() => alert("Secondary clicked")}
          >
            Secondary
          </CustomButton>
          <CustomButton color="danger" onClick={() => alert("Danger clicked")}>
            Danger
          </CustomButton>
          <CustomButton
            color="success"
            onClick={() => alert("Success clicked")}
          >
            Success
          </CustomButton>
          <CustomButton color="ghost" onClick={() => alert("Ghost clicked")}>
            Ghost
          </CustomButton>
        </div>
      </section>

      {/* Colors - Outline */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Colors (Outline)</h2>
        <div className="flex flex-wrap gap-3">
          <CustomButton color="primary" variant="outline">
            Primary
          </CustomButton>
          <CustomButton color="secondary" variant="outline">
            Secondary
          </CustomButton>
          <CustomButton color="danger" variant="outline">
            Danger
          </CustomButton>
          <CustomButton color="success" variant="outline">
            Success
          </CustomButton>
          <CustomButton color="ghost" variant="outline">
            Ghost
          </CustomButton>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Sizes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <CustomButton size="sm">Small</CustomButton>
          <CustomButton size="md">Medium</CustomButton>
          <CustomButton size="lg">Large</CustomButton>
        </div>
      </section>

      {/* Disabled */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Disabled</h2>
        <div className="flex flex-wrap gap-3">
          <CustomButton disabled>Disabled Solid</CustomButton>
          <CustomButton disabled variant="outline">
            Disabled Outline
          </CustomButton>
          <CustomButton disabled color="danger">
            Disabled Danger
          </CustomButton>
        </div>
      </section>

      {/* Loading */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Loading (click to trigger)
        </h2>
        <div className="flex flex-wrap gap-3">
          <CustomButton
            loading={loadingId === "primary"}
            onClick={() => simulateLoading("primary")}
          >
            Submit
          </CustomButton>
          <CustomButton
            color="success"
            loading={loadingId === "success"}
            onClick={() => simulateLoading("success")}
          >
            Save
          </CustomButton>
          <CustomButton
            color="danger"
            variant="outline"
            loading={loadingId === "danger"}
            onClick={() => simulateLoading("danger")}
          >
            Delete
          </CustomButton>
        </div>
      </section>

      {/* With Icons */}
      <section>
        <h2 className="text-xl font-semibold mb-4">With Icons</h2>
        <div className="flex flex-wrap gap-3">
          <CustomButton icon={starIcon}>Favorite</CustomButton>
          <CustomButton icon={arrowIcon} iconPosition="right" color="success">
            Next
          </CustomButton>
          <CustomButton icon={starIcon} variant="outline" color="secondary">
            Bookmark
          </CustomButton>
        </div>
      </section>

      {/* Full Width */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Full Width</h2>
        <div className="flex flex-col gap-3 max-w-md">
          <CustomButton fullWidth>Full Width Primary</CustomButton>
          <CustomButton fullWidth variant="outline" color="secondary">
            Full Width Outline
          </CustomButton>
        </div>
      </section>

      {/* onClick Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">onClick Examples</h2>
        <div className="flex flex-wrap gap-3">
          <CustomButton onClick={() => console.log("Logged to console")}>
            Console Log
          </CustomButton>
          <CustomButton
            color="success"
            onClick={() => alert("Form submitted!")}
          >
            Submit Form
          </CustomButton>
          <CustomButton
            color="danger"
            onClick={() => {
              if (confirm("Are you sure?")) alert("Deleted!");
            }}
          >
            Delete Item
          </CustomButton>
        </div>
      </section>
    </div>
  );
}
