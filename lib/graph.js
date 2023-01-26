export function asGraph(
  data,
  {
    nodeIdKey = "id",
    nodeLabelKey = "label",
    sourceKey = "source",
    targetKey = "target",
  } = {}
) {
  const nodes = data.nodes.map((node) => ({
    id: node[nodeIdKey],
    label: node[nodeLabelKey],
  }));
  const links = data.links.map((link) => ({
    source: link[sourceKey],
    target: link[targetKey],
  }));

  return { nodes, links };
}
