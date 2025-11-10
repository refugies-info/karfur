import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
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
        <Button ref={triggerRef} onClick={() => setOpen(true)}>
          Open Modal
        </Button>

        <Modal open={open} onOpenChange={setOpen} triggerRef={triggerRef} title="Basic Modal">
          <p className="mb-4">This is a basic modal with simple content.</p>
          <Button priority="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
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
        <Button ref={triggerRef} onClick={() => setOpen(true)}>
          Open Modal with Description
        </Button>

        <Modal
          open={open}
          onOpenChange={setOpen}
          triggerRef={triggerRef}
          title="Confirm Action"
          description="This description will be announced by screen readers along with the title."
        >
          <p className="mb-4">Are you sure you want to proceed with this action?</p>
          <div className="flex gap-2">
            <Button onClick={() => setOpen(false)}>Confirm</Button>
            <Button priority="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
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
        <Button ref={triggerRef} onClick={() => setOpen(true)}>
          Open Modal (No Close Button)
        </Button>

        <Modal open={open} onOpenChange={setOpen} triggerRef={triggerRef} title="No Close Button" hideCloseButton>
          <p className="mb-4">This modal has no close button. You must use ESC or click outside to close.</p>
          <Button priority="secondary" onClick={() => setOpen(false)}>
            Close Programmatically
          </Button>
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
        <Button ref={triggerRef} onClick={() => setOpen(true)}>
          Open Small Modal
        </Button>

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
        <Button ref={triggerRef} onClick={() => setOpen(true)}>
          Open Large Modal
        </Button>

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
        <Button ref={triggerRef} onClick={() => setOpen(true)}>
          Open Form Modal
        </Button>

        <Modal
          open={open}
          onOpenChange={setOpen}
          triggerRef={triggerRef}
          title="Contact Form"
          description="Fill out the form below to get in touch"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              nativeInputProps={{
                id: "name",
                type: "text",
                value: formData.name,
                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                required: true,
              }}
            />
            <Input
              label="Email"
              nativeInputProps={{
                id: "email",
                type: "email",
                value: formData.email,
                onChange: (e) => setFormData({ ...formData, email: e.target.value }),
                required: true,
              }}
            />
            <div className="flex gap-2">
              <Button type="submit">Submit</Button>
              <Button type="button" priority="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  },
};
