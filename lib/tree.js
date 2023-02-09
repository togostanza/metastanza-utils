import * as d3 from "d3";

export function asTree(
  data,
  {
    nodeIdKey = "id",
    nodeParentKey = "parent",
    nodeChildrenKey = "children",
    nodeLabelKey = "label",
    nodeValueKey = "value",
    nodeGroupKey = "group",
    nodeColorKey = "color",
    nodeOrderKey = "order",
    nodeDescriptionKey = "description",
  } = {}
) {
  // NOTE: If 'children' and 'parent' in the given data are inconsistent, this function returns unexpected results.
  const parentMap = new Map();

  for (const node of data) {
    const parent = node[nodeParentKey];
    const children = node[nodeChildrenKey];
    const id = node[nodeIdKey];
    if (parent) {
      parentMap.set(id, parent);
    }
    if (children) {
      for (const child of children) {
        parentMap.set(child, id);
      }
    }
  }

  return data.map((node) => {
    const id = node[nodeIdKey];
    const parent = parentMap.get(id);
    const children = [];
    for (const [key, value] of parentMap.entries()) {
      if (value === id) {
        children.push(key);
      }
    }

    return {
      id,
      parent,
      children,
      label: node[nodeLabelKey],
      value: node[nodeValueKey],
      group: node[nodeGroupKey],
      color: node[nodeColorKey],
      order: node[nodeOrderKey],
      description: node[nodeDescriptionKey],
    };
  });
}

export function asD3Hierarchy(
  tree,
  { rootId = undefined, pseudoRootId = "PSEUDO_ROOT" } = {}
) {
  const subTree = structuredClone(
    rootId !== undefined ? selectSubTree(tree, rootId) : tree
  );

  const rootCandidates = subTree.filter((node) => node.parent === undefined);
  if (rootCandidates.length > 1) {
    const pseudoRoot = {
      id: pseudoRootId,
      children: rootCandidates.map((node) => node.id),
    };
    for (const node of rootCandidates) {
      node.parent = pseudoRootId;
    }

    subTree.push(pseudoRoot);
  }

  const data = d3
    .stratify()
    .id((node) => node.id)
    .parentId((node) => node.parent)(subTree);

  return d3.hierarchy(data);
}

function descendantIds(tree, rootId) {
  const root = tree.find((node) => node.id === rootId);
  return [
    root.id,
    ...root.children.flatMap((childId) => descendantIds(tree, childId)),
  ];
}

export function selectSubTree(tree, rootId) {
  const ids = descendantIds(tree, rootId);
  return ids.map((id) => tree.find((node) => node.id === id));
}
