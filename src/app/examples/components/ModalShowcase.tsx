"use client";

import { useState } from "react";
import CustomButton from "@/components/utils/buttons/CustomButton";
import Modal from "@/components/utils/modals/Modal";
import CreateTaskModal from "@/components/modals-and-forms/CreateTaskModal";

export default function ModalShowcase() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [smallOpen, setSmallOpen] = useState(false);
  const [largeOpen, setLargeOpen] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      {/* Basic Modal */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Modal</h2>
        <CustomButton onClick={() => setBasicOpen(true)}>
          Open Basic Modal
        </CustomButton>
        <Modal
          open={basicOpen}
          onClose={() => setBasicOpen(false)}
          title="Basic Modal"
          submitLabel="Confirm"
          onSubmit={() => {
            alert("Confirmed!");
            setBasicOpen(false);
          }}
        >
          <p className="text-gray-600 dark:text-gray-300">
            This is a basic modal with a title, body content, and footer
            buttons. Click the backdrop, the X icon, Cancel, or press Escape to
            close.
          </p>
        </Modal>
      </section>

      {/* Size Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Size Variants</h2>
        <div className="flex flex-wrap gap-3">
          <CustomButton color="secondary" onClick={() => setSmallOpen(true)}>
            Small (sm)
          </CustomButton>
          <CustomButton color="secondary" onClick={() => setLargeOpen(true)}>
            Large (lg)
          </CustomButton>
        </div>
        <Modal
          open={smallOpen}
          onClose={() => setSmallOpen(false)}
          title="Small Modal"
          size="sm"
        >
          <p className="text-gray-600 dark:text-gray-300">
            A compact modal for simple confirmations.
          </p>
        </Modal>
        <Modal
          open={largeOpen}
          onClose={() => setLargeOpen(false)}
          title="Large Modal"
          size="lg"
          submitLabel="Save"
          onSubmit={() => setLargeOpen(false)}
        >
          <p className="text-gray-600 dark:text-gray-300">
            A larger modal for more complex content. Great for forms with many
            fields or detailed information.
          </p>
        </Modal>
      </section>

      {/* Create Task Modal (Custom Form) */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Create Task Modal (Custom Form)
        </h2>
        <CustomButton color="success" onClick={() => setTaskOpen(true)}>
          Create New Task
        </CustomButton>
        <CreateTaskModal
          open={taskOpen}
          onClose={() => setTaskOpen(false)}
          onSubmit={(data) => alert(`Task created: ${JSON.stringify(data, null, 2)}`)}
        />
      </section>
    </div>
  );
}
