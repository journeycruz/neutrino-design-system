export type PlatformContract = {
  name: string;
  guarantee: string;
  source: string;
};

export const platformContracts: PlatformContract[] = [
  {
    name: "Components package boundary",
    guarantee: "Public exports remain stable and semver-governed.",
    source: "docs/platform/architecture-contracts.md"
  },
  {
    name: "Token package boundary",
    guarantee: "Token entry points remain stable unless announced as major.",
    source: "docs/platform/architecture-contracts.md"
  },
  {
    name: "Runtime responsibility split",
    guarantee: "Behavior lives in components, branding stays in tokens/themes.",
    source: "docs/platform/architecture-contracts.md"
  }
];
