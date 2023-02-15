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
    edgeColorKey = "color",
    edgeDescriptionKey = "description",
    edgeGroupKey = "group",
    edgeLabelKey = "label",
    edgeOrderKey = "order",
    edgeValueKey = "value",
    sourceNodeColorKey = "source_color",
    sourceNodeDescriptionKey = "source_description",
    sourceNodeGroupKey = "source_group",
    sourceNodeLabelKey = "source_label",
    sourceNodeOrderKey = "source_order",
    sourceNodeValueKey = "source_value",
    targetNodeColorKey = "target_color",
    targetNodeDescriptionKey = "target_description",
    targetNodeGroupKey = "target_group",
    targetNodeLabelKey = "target_label",
    targetNodeOrderKey = "target_order",
    targetNodeValueKey = "target_value",
  } = {}
) {
  const linksRaw = data instanceof Array ? data : data.links;
  const links = linksRaw.map((link) => ({
    source: link[edgeSourceKey],
    target: link[edgeTargetKey],
    color: link[edgeColorKey],
    description: link[edgeDescriptionKey],
    group: link[edgeGroupKey],
    label: link[edgeLabelKey],
    order: link[edgeOrderKey],
    value: link[edgeValueKey],
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
    const nodes_ = new Map();
    for (const link of linksRaw) {
      nodes_.set(link.source, {
        id: link[edgeSourceKey],
        color: link[sourceNodeColorKey],
        description: link[sourceNodeDescriptionKey],
        group: link[sourceNodeGroupKey],
        label: link[sourceNodeLabelKey],
        order: link[sourceNodeOrderKey],
        value: link[sourceNodeValueKey],
      });
      nodes_.set(link.target, {
        id: link[edgeTargetKey],
        color: link[targetNodeColorKey],
        description: link[targetNodeDescriptionKey],
        group: link[targetNodeGroupKey],
        label: link[targetNodeLabelKey],
        order: link[targetNodeOrderKey],
        value: link[targetNodeValueKey],
      });
    }
    nodes = Array.from(nodes_.values());
  }

  return { nodes, links };
}
