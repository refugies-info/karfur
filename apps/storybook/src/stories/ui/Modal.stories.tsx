import { Modal } from "@refugies-info/ui";
import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";

/**
 * Accessible Modal component built on Radix UI Dialog.
 *
 * ## Features
 * - ✅ WCAG 2.1 AA compliant
 * - ✅ Automatic focus management
 * - ✅ Keyboard navigation (ESC, Tab)
 * - ✅ Screen reader friendly
 * - ✅ Focus returns to trigger element
 *
 * ## Usage
 * ```tsx
 * import { Modal } from "@refugies-info/ui";
 *
 * function MyComponent() {
 *   const [open, setOpen] = useState(false);
 *   const triggerRef = useRef<HTMLButtonElement>(null);
 *
 *   return (
 *     <>
 *       <button ref={triggerRef} onClick={() => setOpen(true)}>
 *         Open Modal
 *       </button>
 *       <Modal
 *         open={open}
 *         onOpenChange={setOpen}
 *         triggerRef={triggerRef}
 *         title="Modal Title"
 *       >
 *         <p>Content goes here</p>
 *       </Modal>
 *     </>
 *   );
 * }
 * ```
 */
const meta = {
  title: "UI/Composites/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An accessible modal component with automatic focus management and WCAG 2.1 compliance. Built on Radix UI Dialog.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic modal with title and simple content
 */
export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
      <div>
        <button
          ref={triggerRef}
          onClick={() => setOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Open Modal
        </button>

        <Modal open={open} onOpenChange={setOpen} triggerRef={triggerRef} title="Basic Modal">
          <p className="mb-4">This is a basic modal with simple content.</p>
          <button onClick={() => setOpen(false)} className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
            Close
          </button>
        </Modal>
      </div>
    );
  },
};

/**
 * Modal with description for screen readers
 */
export const WithDescription: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
      <div>
        <button
          ref={triggerRef}
          onClick={() => setOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Open Modal with Description
        </button>

        <Modal
          open={open}
          onOpenChange={setOpen}
          triggerRef={triggerRef}
          title="Confirm Action"
          description="This description will be announced by screen readers along with the title."
        >
          <p className="mb-4">Are you sure you want to proceed with this action?</p>
          <div className="flex gap-2">
            <button onClick={() => setOpen(false)} className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
              Confirm
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    );
  },
};

/**
 * Modal without close button (must close programmatically)
 */
export const WithoutCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
      <div>
        <button
          ref={triggerRef}
          onClick={() => setOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Open Modal (No Close Button)
        </button>

        <Modal open={open} onOpenChange={setOpen} triggerRef={triggerRef} title="No Close Button" hideCloseButton>
          <p className="mb-4">This modal has no close button. You must use ESC or click outside to close.</p>
          <button onClick={() => setOpen(false)} className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
            Close Programmatically
          </button>
        </Modal>
      </div>
    );
  },
};

/**
 * Small modal (max-width: sm)
 */
export const SmallSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
      <div>
        <button
          ref={triggerRef}
          onClick={() => setOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Open Small Modal
        </button>

        <Modal open={open} onOpenChange={setOpen} triggerRef={triggerRef} title="Small Modal" maxWidth="sm">
          <p>This modal has a smaller max-width.</p>
        </Modal>
      </div>
    );
  },
};

/**
 * Large modal (max-width: 4xl)
 */
export const LargeSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
      <div>
        <button
          ref={triggerRef}
          onClick={() => setOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Open Large Modal
        </button>

        <Modal open={open} onOpenChange={setOpen} triggerRef={triggerRef} title="Large Modal" maxWidth="4xl">
          <p className="mb-4">This modal has a larger max-width for more content.</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded bg-gray-100 p-4">Column 1</div>
            <div className="rounded bg-gray-100 p-4">Column 2</div>
            <div className="rounded bg-gray-100 p-4">Column 3</div>
          </div>
        </Modal>
      </div>
    );
  },
};

/**
 * Modal with form content
 */
export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [formData, setFormData] = useState({ name: "", email: "" });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted:", formData);
      setOpen(false);
    };

    return (
      <div>
        <button
          ref={triggerRef}
          onClick={() => setOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Open Form Modal
        </button>

        <Modal
          open={open}
          onOpenChange={setOpen}
          triggerRef={triggerRef}
          title="Contact Form"
          description="Fill out the form below to get in touch"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Submit
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  },
};
