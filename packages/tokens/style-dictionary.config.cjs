const tokenGlobs = [
  "src/tokens/primitives.json",
  "src/tokens/semantic.json",
  "src/tokens/semantic.*.json",
  "src/tokens/components.json"
];

const primitiveRoots = new Set([
  "font",
  "space",
  "size",
  "radius",
  "border",
  "shadow",
  "opacity",
  "zIndex",
  "breakpoint"
]);

const isPrimitiveToken = (token) => {
  if (token.path[0] === "color" || token.path[0] === "component") {
    return false;
  }

  if (token.path[0] === "motion") {
    return token.path[1] === "duration" || token.path[1] === "easing";
  }

  return primitiveRoots.has(token.path[0]);
};

const isSemanticToken = (token) => {
  if (token.path[0] === "color") {
    return token.path[1] !== "modes";
  }

  return token.path[0] === "typography" || token.path[0] === "layout" || token.path[0] === "motion";
};

const isModeToken = (modeName) => (token) => {
  return token.path[0] === "color" && token.path[1] === "modes" && token.path[2] === modeName;
};

module.exports = {
  source: tokenGlobs,
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "dist/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: {
            outputReferences: true
          }
        },
        {
          destination: "primitives.css",
          format: "css/variables",
          filter: isPrimitiveToken,
          options: {
            outputReferences: true
          }
        },
        {
          destination: "semantic.css",
          format: "css/variables",
          filter: isSemanticToken,
          options: {
            outputReferences: true
          }
        },
        {
          destination: "components.css",
          format: "css/variables",
          filter: (token) => token.path[0] === "component",
          options: {
            outputReferences: true
          }
        },
        {
          destination: "theme-light.css",
          format: "css/variables",
          filter: isModeToken("light"),
          options: {
            outputReferences: true
          }
        },
        {
          destination: "theme-dark.css",
          format: "css/variables",
          filter: isModeToken("dark"),
          options: {
            outputReferences: true
          }
        },
        {
          destination: "theme-high-contrast.css",
          format: "css/variables",
          filter: isModeToken("highContrast"),
          options: {
            outputReferences: true
          }
        }
      ]
    },
    js: {
      transformGroup: "js",
      buildPath: "dist/",
      files: [
        {
          destination: "tokens.js",
          format: "javascript/esm"
        },
        {
          destination: "tokens.cjs",
          format: "javascript/module"
        }
      ]
    }
  }
};
