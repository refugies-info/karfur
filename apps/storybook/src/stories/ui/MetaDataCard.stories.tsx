import { MetaDataCard, MetaDataItem } from "@refugies-info/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "UI/Composites/MetaData/MetaDataCard",
  component: MetaDataCard,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "gradient",
      values: [
        {
          name: "gradient",
          value: "linear-gradient(180deg, #F5F5FE 0%, #FFFFFF 100%)",
        },
        {
          name: "light",
          value: "linear-gradient(180deg, #F5F5FE 0%, #FFFFFF 100%)",
        },
        {
          name: "dark",
          value: "linear-gradient(180deg, #333333 0%, #333333 100%)",
        },
      ],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MetaDataCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Card Title",
    children: [
      <MetaDataItem key="update" icon="fr-icon-time-fill" title="Last update">
        Updated 2 days ago
      </MetaDataItem>,
      <MetaDataItem key="author" icon="fr-icon-user-fill" title="Author">
        John Doe
      </MetaDataItem>,
      <MetaDataItem key="views" icon="fr-icon-eye-fill" title="Views">
        1,234 views
      </MetaDataItem>,
    ],
  },
  globals: {
    backgrounds: {
      value: "gradient",
    },
  },
};

export const WithActions: Story = {
  args: {
    title: "Editable Card",
    children: [
      <MetaDataItem key="location" icon="fr-icon-map-pin-2-line" title="Location">
        Paris, France
      </MetaDataItem>,
      <MetaDataItem key="contact" icon="fr-icon-phone-fill" title="Contact">
        +33 123 456 789
      </MetaDataItem>,
      <MetaDataItem key="email" icon="fr-icon-mail-fill" title="Email">
        contact@example.com
      </MetaDataItem>,
    ],
    onClick: () => console.log("Edit clicked"),
    onDelete: () => console.log("Delete clicked"),
  },
  globals: {
    backgrounds: {
      value: "gradient",
    },
  },
};

export const WithSimpleText: Story = {
  args: {
    title: "Editable Card",
    children: <p>My free-form text</p>,
  },
  globals: {
    backgrounds: {
      value: "gradient",
    },
  },
};

export const InvalidState: Story = {
  args: {
    title: "Invalid Card",
    state: "invalid",
    children: [
      <MetaDataItem key="location" icon="fr-icon-map-pin-2-line" title="Location" state="invalid">
        Missing location
      </MetaDataItem>,
      <MetaDataItem key="contact" icon="fr-icon-phone-fill" title="Contact" state="invalid">
        No contact information
      </MetaDataItem>,
      <MetaDataItem key="email" icon="fr-icon-mail-fill" title="Email" state="invalid">
        Invalid email address
      </MetaDataItem>,
    ],
  },
  globals: {
    backgrounds: {
      value: "gradient",
    },
  },
};

export const InvalidStateWithEditAction: Story = {
  args: {
    title: "Invalid Card",
    state: "invalid",
    onClick: () => console.log("Edit clicked"),
    children: [
      <MetaDataItem key="location" icon="fr-icon-map-pin-2-line" title="Location" state="invalid">
        Missing location
      </MetaDataItem>,
      <MetaDataItem key="contact" icon="fr-icon-phone-fill" title="Contact" state="invalid">
        No contact information
      </MetaDataItem>,
      <MetaDataItem key="email" icon="fr-icon-mail-fill" title="Email" state="invalid">
        Invalid email address
      </MetaDataItem>,
    ],
  },
  globals: {
    backgrounds: {
      value: "gradient",
    },
  },
};
