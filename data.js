import { asD3Hierarchy, asTree } from "./lib/tree";
import { asGraph } from "./lib/graph";
import loadData from "./load-data";

export class Data {
  static async load(
    url,
    {
      type = "json",
      mainElement = null,
      timeout = 10 * 60 * 1000,
      limit = null,
      offset = null,
    } = {}
  ) {
    return new Data(
      await loadData(url, type, mainElement, timeout, limit, offset)
    );
  }

  constructor(data) {
    this.data = data;
  }

  asTree({
    nodeIdKey = "id",
    nodeParentKey = "parent",
    nodeChildrenKey = "children",
    nodeColorKey = "color",
    nodeDescriptionKey = "description",
    nodeGroupKey = "group",
    nodeLabelKey = "label",
    nodeOrderKey = "order",
    nodeValueKey = "value",
  } = {}) {
    return new Tree(
      asTree(this.data, {
        nodeIdKey,
        nodeParentKey,
        nodeChildrenKey,
        nodeColorKey,
        nodeDescriptionKey,
        nodeGroupKey,
        nodeLabelKey,
        nodeOrderKey,
        nodeValueKey,
      })
    );
  }

  asGraph({
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
  } = {}) {
    return new Graph(
      asGraph(this.data, {
        nodesKey,
        edgesKey,
        nodeIdKey,
        nodeColorKey,
        nodeDescriptionKey,
        nodeGroupKey,
        nodeLabelKey,
        nodeOrderKey,
        nodeValueKey,
        edgeSourceKey,
        edgeTargetKey,
        edgeColorKey,
        edgeDescriptionKey,
        edgeGroupKey,
        edgeLabelKey,
        edgeOrderKey,
        edgeValueKey,
        sourceNodeColorKey,
        sourceNodeDescriptionKey,
        sourceNodeGroupKey,
        sourceNodeLabelKey,
        sourceNodeOrderKey,
        sourceNodeValueKey,
        targetNodeColorKey,
        targetNodeDescriptionKey,
        targetNodeGroupKey,
        targetNodeLabelKey,
        targetNodeOrderKey,
        targetNodeValueKey,
      })
    );
  }
}

class Tree extends Data {
  asD3Hierarchy({ rootId = undefined, pseudoRootId = "PSEUDO_ROOT" } = {}) {
    return asD3Hierarchy(this.data, { rootId, pseudoRootId });
  }
}

class Graph extends Data {
  get nodes() {
    return this.data.nodes;
  }

  get edges() {
    return this.data.edges;
  }
}
