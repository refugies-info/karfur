import { Vote } from "@refugies-info/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * The Vote component allows users to provide feedback on content by voting yes or no.
 * It comes in two layouts: standard and sticky.
 */
const meta: Meta<typeof Vote> = {
  title: "UI/Composites/Vote",
  component: Vote,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A voting component that allows users to provide feedback on content with yes/no options.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isSticky: {
      control: "boolean",
      description:
        "Determines if the vote component should be displayed in sticky mode at the bottom of the screen",
    },
    currentVote: {
      control: { type: "radio" },
      options: [true, false, null],
      description: "The current vote state (true for yes, false for no, null for no vote)",
    },
    onVoteYes: {
      action: "voted yes",
      description: "Callback function when user votes yes",
    },
    onVoteNo: {
      action: "voted no",
      description: "Callback function when user votes no",
    },
    onCancelYes: {
      action: "canceled yes vote",
      description: "Callback function when user cancels a yes vote",
    },
    onCancelNo: {
      action: "canceled no vote",
      description: "Callback function when user cancels a no vote",
    },
    onVoteUpdate: {
      action: "vote updated",
      description: "Callback function when user changes their vote",
    },
    className: {
      control: "text",
      description: "Additional CSS class names to apply to the component",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Vote>;

/**
 * Default Vote component with standard layout
 */
export const Default: Story = {
  args: {
    currentVote: null,
    isSticky: false,
  },
};

/**
 * Vote component with Yes selected
 */
export const VotedYes: Story = {
  args: {
    currentVote: true,
    isSticky: false,
  },
};

/**
 * Vote component with No selected
 */
export const VotedNo: Story = {
  args: {
    currentVote: false,
    isSticky: false,
  },
};

/**
 * Vote component with sticky layout that appears at the bottom of the screen
 */
export const StickyLayout: Story = {
  args: {
    currentVote: null,
    isSticky: true,
  },
};

/**
 * Vote component with sticky layout and Yes selected
 */
export const StickyVotedYes: Story = {
  args: {
    currentVote: true,
    isSticky: true,
  },
};

/**
 * Vote component with sticky layout and No selected
 */
export const StickyVotedNo: Story = {
  args: {
    currentVote: false,
    isSticky: true,
  },
};
