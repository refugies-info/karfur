import { MetaDataItem } from "@refugies-info/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "UI/Composites/MetaData/MetaDataItem",
  component: MetaDataItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MetaDataItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcon: Story = {
  args: {
    icon: "fr-icon-info-line",
    title: "Information Item",
    children: <p>This is a metadata item with an icon</p>,
  },
};

export const WithLogoImage: Story = {
  args: {
    logoImage: {
      url: "https://placeholder.com/32x32",
      alt: "Logo",
    },
    title: "Logo Item",
    children: <p>This is a metadata item with a logo image</p>,
  },
};

export const WithEditAction: Story = {
  args: {
    icon: "fr-icon-info-line",
    title: "Editable Item",
    children: <p>This item can be edited</p>,
    onClick: () => console.log("Edit clicked"),
  },
};

export const NoIconOrLogo: Story = {
  args: {
    title: "Simple Item",
    children: <p>This is a simple metadata item without icon or logo</p>,
  },
};

export const WithLink: Story = {
  args: {
    icon: "fr-icon-links-line",
    title: "Item with Link",
    children: (
      <p>
        This item contains a <a href="#">link</a>
      </p>
    ),
  },
};

export const InvalidState: Story = {
  args: {
    icon: "fr-icon-error-warning-line",
    title: "Invalid Item",
    state: "invalid",
    children: <p>This item has invalid or missing information</p>,
  },
};

export const InvalidStateWithEditAction: Story = {
  args: {
    icon: "fr-icon-error-warning-line",
    title: "Invalid Item",
    state: "invalid",
    onClick: () => console.log("Edit clicked"),
    children: <p>This item has invalid or missing information</p>,
  },
};
