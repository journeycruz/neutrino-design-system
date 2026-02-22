import axeCore from "axe-core";

export const runAxe = async (element: Element) => {
  return axeCore.run(element, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]
    }
  });
};
