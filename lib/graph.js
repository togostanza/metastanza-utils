export function asGraph(
  data,
  {
    nodeIdKey = "id",
    nodeLabelKey = "label",
    sourceKey = "source",
    targetKey = "target",
  } = {}
) {
  // TODO treat case where data is an instance of array

  let nodes;
  if (data.nodes) {
    nodes = data.nodes.map((node) => ({
      id: node[nodeIdKey],
      label: node[nodeLabelKey],
    }));
  } else {
    // Create nodes using ids that appear in links.
    const nodeIds = new Set();
    for (const link of data.links) {
      nodeIds.add(link[sourceKey]);
      nodeIds.add(link[targetKey]);
    }
    nodes = Array.from(nodeIds).map((id) => ({ id }));
  }

  const links = data.links.map((link) => ({
    source: link[sourceKey],
    target: link[targetKey],
  }));

  return { nodes, links };
}
