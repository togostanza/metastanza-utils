export function asGraph(
  data,
  { nodeIdKey = "id", sourceKey = "source", targetKey = "target" } = {}
) {
  const nodes = data.nodes.map((node) => ({ id: node[nodeIdKey] }));
  const links = data.links.map((link) => ({
    source: link[sourceKey],
    target: link[targetKey],
  }));

  return { nodes, links };
}
