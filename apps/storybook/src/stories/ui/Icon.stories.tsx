// We're manually defining the icon names, so we don't need to import the types
import { Icon } from "@refugies-info/ui";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * The Icon component renders SVG icons from the DSFR (Design System France) library.
 * It supports both FrIconClassName and RiIconClassName icon types.
 */

// Since we can't access TypeScript type information at runtime,
// we need to use a different approach to get all available icons.

// This function simulates fetching all available icons
// In a real implementation, you could scan your assets directory
// or use an API to get the complete list of available icons
function getAllIconNames(): string[] {
  // Since FrIconClassName and RiIconClassName are types, not runtime values,
  // we need to manually define the icon names

  // DSFR icons (fr-icon-*)
  const frIcons = [
    "fr-icon-information-line",
    "fr-icon-warning-line",
    "fr-icon-success-line",
    "fr-icon-arrow-right-line",
    "fr-icon-arrow-left-line",
    "fr-icon-arrow-up-line",
    "fr-icon-arrow-down-line",
    "fr-icon-close-line",
    "fr-icon-add-line",
    "fr-icon-subtract-line",
    "fr-icon-checkbox-circle-line",
    "fr-icon-error-line",
    "fr-icon-alert-line",
    "fr-icon-question-line",
    "fr-icon-search-line",
    "fr-icon-edit-line",
    "fr-icon-delete-line",
    "fr-icon-refresh-line",
    "fr-icon-download-line",
    "fr-icon-upload-line",
  ];

  // Remix icons (ri-*)
  const riIcons = [
    "ri-user-line",
    "ri-home-line",
    "ri-search-line",
    "ri-settings-line",
    "ri-notification-line",
    "ri-mail-line",
    "ri-chat-line",
    "ri-calendar-line",
    "ri-file-line",
    "ri-folder-line",
    "ri-bookmark-line",
    "ri-heart-line",
    "ri-star-line",
    "ri-time-line",
    "ri-map-pin-line",
  ];

  return [...frIcons, ...riIcons];
}

const meta: Meta<typeof Icon> = {
  title: "UI/Primitives/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible icon component that renders SVG icons from the DSFR library with customizable size and color.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: getAllIconNames(),
      description: "The name of the icon to display (FrIconClassName or RiIconClassName)",
    },
    size: {
      control: { type: "number", min: 12, max: 64, step: 4 },
      description: "Size of the icon in pixels",
    },
    color: {
      control: "color",
      description: "Color of the icon",
    },
    className: {
      control: "text",
      description: "Additional CSS class names to apply to the icon",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

/**
 * Default Icon with standard size and color
 */
export const Default: Story = {
  args: {
    name: "fr-icon-information-line",
    size: 24,
    color: "currentColor",
  },
};

/**
 * Large Icon example
 */
export const Large: Story = {
  args: {
    name: "fr-icon-information-line",
    size: 48,
    color: "currentColor",
  },
};

/**
 * Colored Icon example
 */
export const Colored: Story = {
  args: {
    name: "fr-icon-warning-line",
    size: 24,
    color: "#E1000F",
  },
};

/**
 * Arrow Icon example
 */
export const Arrow: Story = {
  args: {
    name: "fr-icon-arrow-right-line",
    size: 24,
    color: "currentColor",
  },
};

/**
 * Remix Icon example
 */
export const RemixIcon: Story = {
  args: {
    name: "ri-user-line",
    size: 24,
    color: "currentColor",
  },
};

/**
 * Icon Grid showcasing multiple icons with different sizes and colors
 */
export const IconGrid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col items-center">
        <Icon name="fr-icon-information-line" size={24} color="#000091" />
        <span className="mt-2 text-xs">Information</span>
      </div>
      <div className="flex flex-col items-center">
        <Icon name="fr-icon-warning-line" size={24} color="#E1000F" />
        <span className="mt-2 text-xs">Warning</span>
      </div>
      <div className="flex flex-col items-center">
        <Icon name="fr-icon-success-line" size={24} color="#18753C" />
        <span className="mt-2 text-xs">Success</span>
      </div>
      <div className="flex flex-col items-center">
        <Icon name="ri-home-line" size={24} color="#000091" />
        <span className="mt-2 text-xs">Home</span>
      </div>
      <div className="flex flex-col items-center">
        <Icon name="ri-user-line" size={24} color="#000091" />
        <span className="mt-2 text-xs">User</span>
      </div>
      <div className="flex flex-col items-center">
        <Icon name="ri-search-line" size={24} color="#000091" />
        <span className="mt-2 text-xs">Search</span>
      </div>
    </div>
  ),
};
