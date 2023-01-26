export function asGraph(
  data,
  {
    nodeIdKey = "id",
    nodeLabelKey = "label",
    nodeGroupKey = "group",
    sourceKey = "source",
    targetKey = "target",
  } = {}
) {
  const links = (data instanceof Array ? data : data.links).map((link) => ({
    source: link[sourceKey],
    target: link[targetKey],
  }));

  let nodes;
  if (!(data instanceof Array) && data.nodes) {
    nodes = data.nodes.map((node) => ({
      id: node[nodeIdKey],
      label: node[nodeLabelKey],
      group: node[nodeGroupKey],
    }));
  } else {
    // Create nodes using ids that appear in links.
    const nodeIds = new Set();
    for (const link of links) {
      nodeIds.add(link.source);
      nodeIds.add(link.target);
    }
    nodes = Array.from(nodeIds).map((id) => ({ id }));
  }

  return { nodes, links };
}
