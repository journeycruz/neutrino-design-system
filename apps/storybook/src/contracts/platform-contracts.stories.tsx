import type { Meta, StoryObj } from "@storybook/react-vite";

import { platformContracts } from "../index";

function PlatformContractsOverview() {
  return (
    <div style={{ maxWidth: 760, lineHeight: 1.5 }}>
      <h2>Platform Contracts</h2>
      <p>
        These contracts define stable behavior and API expectations for
        components, tokens, and Storybook documentation.
      </p>
      <ul>
        {platformContracts.map((item) => (
          <li key={item.name}>
            <strong>{item.name}:</strong> {item.guarantee} <code>{item.source}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}

const meta = {
  title: "Platform/Contracts/Overview",
  component: PlatformContractsOverview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Contract-level guidance for package boundaries, semver commitments, and theming responsibility split."
      }
    }
  },
  tags: ["autodocs"]
} satisfies Meta<typeof PlatformContractsOverview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
