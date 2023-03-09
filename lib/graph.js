export function asGraph(
  data,
  {
    nodesKey = "nodes",
    edgesKey = "edges",
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
  const edgesRaw = data instanceof Array ? data : data[edgesKey];
  const edges = edgesRaw.map((edge) => ({
    source: edge[edgeSourceKey],
    target: edge[edgeTargetKey],
    color: edge[edgeColorKey],
    description: edge[edgeDescriptionKey],
    group: edge[edgeGroupKey],
    label: edge[edgeLabelKey],
    order: edge[edgeOrderKey],
    value: edge[edgeValueKey],
  }));

  let nodes;
  if (!(data instanceof Array) && data[nodesKey]) {
    nodes = data[nodesKey].map((node) => ({
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
    for (const edge of edgesRaw) {
      nodes_.set(edge.source, {
        id: edge[edgeSourceKey],
        color: edge[sourceNodeColorKey],
        description: edge[sourceNodeDescriptionKey],
        group: edge[sourceNodeGroupKey],
        label: edge[sourceNodeLabelKey],
        order: edge[sourceNodeOrderKey],
        value: edge[sourceNodeValueKey],
      });
      nodes_.set(edge.target, {
        id: edge[edgeTargetKey],
        color: edge[targetNodeColorKey],
        description: edge[targetNodeDescriptionKey],
        group: edge[targetNodeGroupKey],
        label: edge[targetNodeLabelKey],
        order: edge[targetNodeOrderKey],
        value: edge[targetNodeValueKey],
      });
    }
    nodes = Array.from(nodes_.values());
  }

  return { nodes, edges };
}
