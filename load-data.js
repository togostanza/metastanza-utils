import * as d3 from "d3";
import { asD3Hierarchy, asTree } from "./lib/tree";
import { asGraph } from "./lib/graph";

let style;

export function showLoadingIcon(element) {
  if (element.offsetHeight < 30) {
    d3.select(element).transition().duration(100).style("min-height", "30px");
  }

  const css = (key) => getComputedStyle(element).getPropertyValue(key);
  const spinnerBgColor = css("--togostanza-loading_spinner-bg_color");
  const spinnerColor = css("--togostanza-loading_spinner-color");

  style = document.createElement("style");
  style.setAttribute("id", "spinner-css");

  style.innerHTML = getSpinnerCss(
    spinnerBgColor || "rgba(0,0,0,0.2)",
    spinnerColor || "#fff"
  );
  element.getRootNode().appendChild(style);

  const container = d3
    .select(element)
    .append("div")
    .classed("metastanza-loading-icon-div", true)
    .attr("id", "metastanza-loading-icon-div");

  const wrap = container.append("div").classed("spinner-wrap", true);
  const circle = wrap.append("div").classed("circle", true);
  const spinner = circle
    .append("div")
    .classed("spinner", true)
    .attr("style", "--count: 12");

  for (let i = 0; i < 12; i++) {
    spinner.append("span").attr("style", `--index: ${i}`);
  }
}

export function hideLoadingIcon(element) {
  style?.remove();
  d3.select(element).select("#metastanza-loading-icon-div").remove();
}

function displayApiError(element, error) {
  d3.select(element).select(".metastanza-error-message-div").remove();
  const p = d3
    .select(element)
    .append("div")
    .attr("class", "metastanza-error-message-div")
    .append("p")
    .attr("class", "metastanza-error-message");
  p.append("span").text("MetaStanza API error");
  p.append("br");
  p.append("span").text(error);
}

function withAcceptHeader(fetcher, accept) {
  return (url, requestInit) => {
    const requestInitWithHeader = {
      headers: {
        Accept: accept,
      },
      ...requestInit,
    };

    return fetcher(url, requestInitWithHeader);
  };
}

function loadJSON(url, requestInit) {
  return fetch(url, requestInit).then((res) => res.json());
}

function sparql2table(json) {
  const head = json.head.vars;
  const data = json.results.bindings;

  return data.map((item) => {
    const row = {};
    head.forEach((key) => {
      row[key] = item[key] ? item[key].value : "";
    });
    return row;
  });
}

async function loadSPARQL(url, requestInit) {
  const json = await fetch(url, requestInit).then((res) => res.json());

  return sparql2table(json);
}

async function loadElasticsearch(url, requestInit) {
  const json = await fetch(url, requestInit).then((res) => res.json());

  return json.hits.hits.map((hit) => hit._source);
}

function getLoader(type) {
  switch (type) {
    case "text":
      return withAcceptHeader(d3.text, "text/plain");
    case "tsv":
      return withAcceptHeader(d3.tsv, "text/tab-separated-values");
    case "csv":
      return withAcceptHeader(d3.csv, "text/csv");
    case "sparql-results-json":
      return withAcceptHeader(loadSPARQL, "application/sparql-results+json");
    case "elasticsearch":
      return withAcceptHeader(loadElasticsearch, "application/json");
    case "json":
    default:
      return withAcceptHeader(loadJSON, "application/json");
  }
}

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
    nodeLabelKey = "label",
    nodeValueKey = "value",
  } = {}) {
    return new Tree(
      asTree(this.data, {
        nodeIdKey,
        nodeParentKey,
        nodeChildrenKey,
        nodeLabelKey,
        nodeValueKey,
      })
    );
  }

  asGraph({
    nodeIdKey = "id",
    nodeLabelKey = "label",
    nodeGroupKey = "group",
    edgeSourceKey = "source",
    edgeTargetKey = "target",
  } = {}) {
    return new Graph(
      asGraph(this.data, {
        nodeIdKey,
        nodeLabelKey,
        nodeGroupKey,
        edgeSourceKey,
        edgeTargetKey,
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

  get links() {
    return this.data.links;
  }
}

let cache = null;
let cacheKey = null;

export default async function loadData(
  url,
  type = "json",
  mainElement = null,
  timeout = 10 * 60 * 1000,
  limit = null,
  offset = null
) {
  const _cacheKey = JSON.stringify({ url, type, limit, offset });
  if (cacheKey === _cacheKey) {
    return cache;
  }

  const u = new URL(url);
  if (limit) {
    u.searchParams.set(type === "elasticsearch" ? "size" : "limit", limit);
  }
  if (offset) {
    u.searchParams.set(type === "elasticsearch" ? "from" : "offset", offset);
  }

  const loader = getLoader(type);
  let data = null;

  const controller = new AbortController();
  const requestInit = {
    signal: controller.signal,
  };

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    if (mainElement) {
      showLoadingIcon(mainElement);
    }
    data = await loader(u, requestInit);

    cache = data;
    cacheKey = _cacheKey;
  } catch (error) {
    if (mainElement) {
      const detail =
        error.name === "AbortError"
          ? "Error: Request timed out."
          : error.toString();

      displayApiError(mainElement, detail);
    }

    throw error;
  } finally {
    if (mainElement) {
      hideLoadingIcon(mainElement);
    }
    clearTimeout(timer);
  }

  return data;
}

function getSpinnerCss(bgColor, spinnerColor) {
  return `
  :host {
    --loading_spinner_bg_color: ${bgColor};
    --loading_spinner_color: ${spinnerColor};
  }

  .metastanza-loading-icon-div {
    display: flex;
    align-items: center;
    height: 150px;
  }

  .spinner-wrap {
    position: absolute;
    left: 50%;
  }

  .circle {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--loading_spinner_bg_color);
    transform: translate(-50%, -50%);
  }

  .spinner {
    position: absolute;
    inset: 50%;
    animation: spin 2s steps(var(--count), end) infinite;
  }

  .spinner span {
    position: absolute;
    height: 2px;
    width: 4px;
    top: -1px;
    left: -2px;
    background-color: var(--loading_spinner_color);
    border-radius: 1.5px;
    transform: rotate(calc(var(--index) * 30deg)) translateX(6px) scaleY(0.5);
    opacity: calc(var(--index) / var(--count));
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  `;
}
