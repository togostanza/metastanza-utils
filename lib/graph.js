export function asGraph(
  data,
  {
    nodeIdKey = "id",
    nodeColorKey = "color",
    nodeDescriptionKey = "description",
    nodeGroupKey = "group",
    nodeLabelKey = "label",
    nodeOrderKey = "order",
    nodeValueKey = "value",
    edgeSourceKey = "source",
    edgeTargetKey = "target",
  } = {}
) {
  const links = (data instanceof Array ? data : data.links).map((link) => ({
    source: link[edgeSourceKey],
    target: link[edgeTargetKey],
  }));

  let nodes;
  if (!(data instanceof Array) && data.nodes) {
    nodes = data.nodes.map((node) => ({
      id: node[nodeIdKey],
      color: node[nodeColorKey],
      description: node[nodeDescriptionKey],
      group: node[nodeGroupKey],
      label: node[nodeLabelKey],
      order: node[nodeOrderKey],
      value: node[nodeValueKey],
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
