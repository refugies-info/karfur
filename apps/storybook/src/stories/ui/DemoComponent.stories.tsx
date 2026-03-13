import { DemoComponent } from "@refugies-info/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof DemoComponent> = {
  title: "UI/DemoComponent",
  component: DemoComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DemoComponent>;

export const Default: Story = {
  args: {
    children: "Click me",
  },
};
