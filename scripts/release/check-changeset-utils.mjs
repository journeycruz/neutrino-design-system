export const extractExportNames = (source) => {
  const exportBlocks = [...source.matchAll(/export\s*\{([^}]*)\}/gms)];
  const names = new Set();

  for (const block of exportBlocks) {
    const members = block[1]
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

    for (const member of members) {
      const normalized = member.replace(/^type\s+/, "");
      const alias = normalized.split(/\s+as\s+/i).at(-1)?.trim();
      if (alias) {
        names.add(alias);
      }
    }
  }

  return names;
};

export const formatNames = (values) => [...values].sort().join(", ");

export const diffExportNames = (baseSource, headSource) => {
  const baseExports = extractExportNames(baseSource);
  const headExports = extractExportNames(headSource);

  const added = [...headExports].filter((name) => !baseExports.has(name)).sort();
  const removed = [...baseExports].filter((name) => !headExports.has(name)).sort();

  return {
    added,
    removed,
    changed: added.length > 0 || removed.length > 0
  };
};

export const hasExportsSection = (changesets) =>
  changesets.some(({ content }) => /^##\s*Exports\b/im.test(content));
