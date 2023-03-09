# Data class

```javascript
import { Data } from "togostanza-utils/data";
```


## Data.load()

```javascript
Data.load(url, { type, mainElement, timeout, limit, offset })
```

Load data from url and returns `Data` object.

- `url` The URL to fetch.
- `type` Type of file being retrieved. `"text"`, `"tsv"`, `"csv"`, `"sparql-results-json"`, `"elasticsearch"`, `"json"` (Optional. Default is `"json"`.)
- `mainElement` The main element of the stanza. Used for spinner and error indication if specified. (Optional. Default is `null`.)
- `timeout` Timeout in milliseconds. (Optional. Default is 10 minutes.)
- `limit` The number of records to try to retrieve. If `type` is `"elasticsearch"`, this parameter is passed as `size` query parameter. Otherwise, passed as `limit`.
- `offset` Starting record offset to try to retrieve. If `type` is `"elasticsearch"`, this parameter is passed as `from` query parameter. Otherwise, passed as `offset`.


## .data

Contains the raw data loaded.

## .asTree()

```javascript
data.asTree({ nodeIdKey, nodeParentKey, nodeChildrenKey, nodeColorKey, nodeDescriptionKey, nodeGroupKey, nodeLabelKey, nodeOrderKey, nodeValueKey })
```

Interpret the loaded data as a tree and return a `Tree` object.

`asTree()` can interpret a tree described in two ways:

* by specifying the ID of the parent
* by specifying the ID of the children as an array

Note that the result is undefined given inconsistent data.

Arguments:

- `nodeIdKey` The key of the node ID. (Optional. Default is `"id"`)
- `nodeParentKey` The key of the parent node ID. (Optional. Default is `"parent"`)
- `nodeChildrenKey` The key of the children node IDs. (Optional. Default is `"children"`)
- `nodeColorKey` The key of the node color. (Optional. Default is `"color"`)
- `nodeDescriptionKey` The key of the node description. (Optional. Default is `"description"`)
- `nodeGroupKey` The key of the node group. (Optional. Default is `"group"`)
- `nodeLabelKey` The key of the node label. (Optional. Default is `"label"`)
- `nodeOrderKey` The key of the node order. (Optional. Default is `"order"`)
- `nodeValueKey` The key of the node value. (Optional. Default is `"value"`)


## .asGraph()

```javascript
data.asGraph({ nodesKey, edgesKey, nodeIdKey, nodeColorKey, nodeDescriptionKey, nodeGroupKey, nodeLabelKey, nodeOrderKey, nodeValueKey, edgeSourceKey, edgeTargetKey, edgeColorKey, edgeDescriptionKey, edgeGroupKey, edgeLabelKey, edgeOrderKey, edgeValueKey, sourceNodeColorKey, sourceNodeDescriptionKey, sourceNodeGroupKey, sourceNodeLabelKey, sourceNodeOrderKey, sourceNodeValueKey, targetNodeColorKey, targetNodeDescriptionKey, targetNodeGroupKey, targetNodeLabelKey, targetNodeOrderKey, targetNodeValueKey })
```

Interpret the loaded data as a tree and return a `Graph` object.

`asGraph()` can interpret a graph described in two ways:

* both edges and nodes are given
* only edges are given

Note that the result is undefined given inconsistent data.

Arguments:

- Data structure
    - `nodesKey` The key of the nodes. (Optional. Default is `"nodes"`)
    - `edgesKey` The key of the edges. (Optional. Default is `"edges"`)

- Node properties
    - `nodeIdKey` The key of the node ID. (Optional. Default is `"id"`)
    - `nodeColorKey` The key of the node color. (Optional. Default is `"color"`)
    - `nodeDescriptionKey` The key of the node description. (Optional. Default is `"description"`)
    - `nodeGroupKey` The key of the node group. (Optional. Default is `"group"`)
    - `nodeLabelKey` The key of the node label. (Optional. Default is `"label"`)
    - `nodeOrderKey` The key of the node order. (Optional. Default is `"order"`)
    - `nodeValueKey` The key of the node value. (Optional. Default is `"value"`)

- Edge properties
    - `edgeSourceKey` The key of the source node ID. (Optional. Default is `"source"`)
    - `edgeTargetKey` The key of the target node ID. (Optional. Default is `"target"`)
    - `edgeColorKey` The key of the edge color. (Optional. Default is `"color"`)
    - `edgeDescriptionKey` The key of the edge description. (Optional. Default is `"description"`)
    - `edgeGroupKey` The key of the edge group. (Optional. Default is `"group"`)
    - `edgeLabelKey` The key of the edge label. (Optional. Default is `"label"`)
    - `edgeOrderKey` The key of the edge order. (Optional. Default is `"order"`)
    - `edgeValueKey` The key of the edge value. (Optional. Default is `"value"`)

- Node properties to be delived from both ends of the edge (used when only edges are specified in the data)
    - Source node
        - `sourceNodeColorKey` The key of the source node color. (Optional. Default is `"source_color"`)
        - `sourceNodeDescriptionKey` The key of the source node description. (Optional. Default is `"source_description"`)
        - `sourceNodeGroupKey` The key of the source node group. (Optional. Default is `"source_group"`)
        - `sourceNodeLabelKey` The key of the source node label. (Optional. Default is `"source_label"`)
        - `sourceNodeOrderKey` The key of the source node order. (Optional. Default is `"source_order"`)
        - `sourceNodeValueKey` The key of the source node value. (Optional. Default is `"source_value"`)
    - Target node
        - `targetNodeColorKey` The key of the target node color. (Optional. Default is `"target_color"`)
        - `targetNodeDescriptionKey` The key of the target node description. (Optional. Default is `"target_description"`)
        - `targetNodeGroupKey` The key of the target node group. (Optional. Default is `"target_group"`)
        - `targetNodeLabelKey` The key of the target node label. (Optional. Default is `"target_label"`)
        - `targetNodeOrderKey` The key of the target node order. (Optional. Default is `"target_order"`)
        - `targetNodeValueKey` The key of the target node value. (Optional. Default is `"target_value"`)

# Tree class

A class that represents trees.

## .data

Contains the tree nodes. A node has the following properties:

- id
- parent
- children
- color
- description
- group
- label
- order
- value


## .asD3Hierarchy()

```javascript
tree.asD3Hierarchy({ rootId, pseudoRootId })
```

Returns a D3 hierarchy object.

Since `D3Hierarchy` does not allow for more than one root node, a partial tree must be selected or a node without a parent must be connected to the pseudo-root.

Arguments:

- `rootId` The ID of the root node to select. If given, returns a subtree with that node as root. (Optional. Default is `null`.)
- `pseudoRootId` The ID of the pseudo root node. Nodes without their parents (potential root nodes) are connected to this pseudo-root node identified by the ID. (Optional. Default is `"PSEUDO_ROOT"`.)



# Graph class

A class that represents directed graphs.


## .nodes

Returns an array of nodes. A node has the following properties:

- id
- color
- description
- group
- label
- order
- value

## .edges

Returns an array of edges. An edge has the following properties:

- source
- target
- color
- description
- group
- label
- order
- value