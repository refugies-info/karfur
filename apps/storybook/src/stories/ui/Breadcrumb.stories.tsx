import { Breadcrumb } from "@refugies-info/ui";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * The Breadcrumb component provides navigation context by showing the current location within the site hierarchy.
 * It automatically includes a home icon as the first item and wraps the DSFR Breadcrumb component.
 */
const meta: Meta<typeof Breadcrumb> = {
  title: "UI/Composites/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A navigation component that displays the current location within the site hierarchy with an automatic home icon.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    segments: {
      control: "object",
      description: "Array of breadcrumb segments to display",
    },
    currentPageLabel: {
      control: "text",
      description: "Label for the current page (not clickable)",
    },
    homeLabel: {
      control: "text",
      description: "Accessible label for the home icon (default: 'Accueil')",
    },
    className: {
      control: "text",
      description: "Additional CSS class names",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    segments: [
      {
        label: "Page d'accueil",
        linkProps: { href: "/" },
      },
      {
        label: "Documentation",
        linkProps: { href: "/docs" },
      },
    ],
    currentPageLabel: "Guide d'utilisation",
    homeLabel: "Accueil",
  },
};

export const WithCustomHome: Story = {
  args: {
    segments: [
      {
        label: "Tableau de bord",
        linkProps: { href: "/dashboard" },
      },
      {
        label: "Paramètres",
        linkProps: { href: "/dashboard/settings" },
      },
    ],
    currentPageLabel: "Profil",
    homeLabel: "Tableau de bord",
  },
};

export const SingleLevel: Story = {
  args: {
    segments: [],
    currentPageLabel: "Tableau de bord",
    homeLabel: "Accueil",
  },
};
