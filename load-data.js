import * as d3 from "d3";

let style

export function showLoadingIcon(element) {
  if (element.offsetHeight < 30) {
    d3.select(element).transition().duration(100).style("min-height", "30px");
  }

  const css = (key) => getComputedStyle(element).getPropertyValue(key);

  const spinnerColor = css('--togostanza-loading-spinner-color');

  const main = d3.select(element)
    .classed("main-center", true)

  style = document.createElement('style')
  style.setAttribute('id', 'spinner-css')

  style.innerHTML = getSpinnerCss(spinnerColor || 'grey')
  element.getRootNode().appendChild(style)

  const container = d3.select(element)
    .append("div")
    .attr("class", "metastanza-loading-icon-div")
    .attr("id", "metastanza-loading-icon-div")

    container
    .append('div')
    .classed('loading', true)

    container
    .append('div')
    .classed('circle', true)
}

export function hideLoadingIcon(element) {
  // const root = element.getRootNode();
  // console.log(root);
  // const style = root.querySelector('#spinner-css');
  if (style) {
    console.log(style)
    style.remove();
  }
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

async function loadJSON(url, requestInit) {
  const res = await fetch(url, requestInit);
  return await res.json();
}

// TODO: test & improve
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
  const requestInitWithHeader = {
    headers: {
      Accept: "application/sparql-results+json",
    },
    ...requestInit,
  };

  const json = await loadJSON(url, requestInitWithHeader);
  return sparql2table(json);
}

function getLoader(type) {
  switch (type) {
    case "tsv":
      return d3.tsv;
    case "csv":
      return d3.csv;
    case "sparql-results-json":
      return loadSPARQL;
    case "json":
    default:
      return loadJSON;
  }
}

let cache = null;
let cacheKey = null;

export default async function loadData(
  url,
  type = "json",
  mainElement = null,
  timeout = 10 * 60 * 1000
) {
  const _cacheKey = JSON.stringify({ url, type });
  if (cacheKey === _cacheKey) {
    return cache;
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
    data = await loader(url, requestInit);

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

// async function sparql2tree(url){
//   const json = await loadJSON(url);
//   const treeJson = sparql2table(json); //rootのオブジェクトが必要
//   const rootNode = {
//     "child_name": sparql2table(json)[0].root_name
//   }

//   treeJson.unshift(rootNode);
//   treeJson.forEach(data => {
//     if(!treeJson.some(datum => data.parent_name === datum.child_name)) {
//       console.log('親無し', data)
//     }
//   })
//   return treeJson;

//   //test loading function
//   const array1 = sparql2table(json); //rootのオブジェクトが必要
//   const rootNode = {
//     "child_name": sparql2table(json)[0].root_name
//   }

//   array1.unshift(rootNode);
//   array1.forEach(data => {
//     if(!array1.some(datum => data.parent_name === datum.child_name)) {
//       console.log('親無し', data)
//     }
//   })
//   console.log("array1",array1);

//   const testData =
//   [
//     {
//       "child_name": "first",
//     },
//     {
//       "child_name": "second",
//       "parent_name": "first"
//     },
//     {
//       "child_name": "forth",
//       "parent_name": "first"
//     },
//     {
//       "child_name": "third",
//       "parent_name": "second"
//     }
//   ]
//   console.log('testData',testData)

//   return array1;
//   return testData;
// }


function getSpinnerCss(color) {
  return `
  :host {
    --LOADING_SPINNER_BACKGROUND: ${color};
    --DOT_1: rgba(255,255,255,1);
    --DOT_2: rgba(255,255,255,0.8);
    --DOT_3: rgba(255,255,255,0.6);
    --DOT_4: rgba(255,255,255,0.4);
  }

  .main-center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 140px;
  }

  .metastanza-loading-icon-div {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: var(--LOADING_SPINNER_BACKGROUND);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 5px var(--LOADING_SPINNER_BACKGROUND),
      0px 0px 5px var(--LOADING_SPINNER_BACKGROUND);
  }

  .loading {
    height: 1em;
    width: 1em;
    border-radius: 50%;
    -webkit-animation: load 1.1s infinite ease;
    animation: load 1.5s infinite ease;
    z-index: 1;
  }

  @-webkit-keyframes load {
    0%,
    100% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_1), 1.8em -1.8em 0 0em var(--DOT_4),
        2.5em 0em 0 0em var(--DOT_4), 1.75em 1.75em 0 0em var(--DOT_4), 0em 2.5em 0 0em var(--DOT_4),
        -1.8em 1.8em 0 0em var(--DOT_4), -2.6em 0em 0 0em var(--DOT_3),
        -1.8em -1.8em 0 0em var(--DOT_2);
    }
    12.5% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_2), 1.8em -1.8em 0 0em var(--DOT_1),
        2.5em 0em 0 0em var(--DOT_4), 1.75em 1.75em 0 0em var(--DOT_4), 0em 2.5em 0 0em var(--DOT_4),
        -1.8em 1.8em 0 0em var(--DOT_4), -2.6em 0em 0 0em var(--DOT_4),
        -1.8em -1.8em 0 0em var(--DOT_3);
    }
    25% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_3), 1.8em -1.8em 0 0em var(--DOT_2),
        2.5em 0em 0 0em var(--DOT_1), 1.75em 1.75em 0 0em var(--DOT_4), 0em 2.5em 0 0em var(--DOT_4),
        -1.8em 1.8em 0 0em var(--DOT_4), -2.6em 0em 0 0em var(--DOT_4),
        -1.8em -1.8em 0 0em var(--DOT_4);
    }
    37.5% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_4), 1.8em -1.8em 0 0em var(--DOT_3),
        2.5em 0em 0 0em var(--DOT_2), 1.75em 1.75em 0 0em var(--DOT_1), 0em 2.5em 0 0em var(--DOT_4),
        -1.8em 1.8em 0 0em var(--DOT_4), -2.6em 0em 0 0em var(--DOT_4),
        -1.8em -1.8em 0 0em var(--DOT_4);
    }
    50% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_4), 1.8em -1.8em 0 0em var(--DOT_4),
        2.5em 0em 0 0em var(--DOT_3), 1.75em 1.75em 0 0em var(--DOT_2), 0em 2.5em 0 0em var(--DOT_1),
        -1.8em 1.8em 0 0em var(--DOT_4), -2.6em 0em 0 0em var(--DOT_4),
        -1.8em -1.8em 0 0em var(--DOT_4);
    }
    62.5% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_4), 1.8em -1.8em 0 0em var(--DOT_4),
        2.5em 0em 0 0em var(--DOT_4), 1.75em 1.75em 0 0em var(--DOT_3), 0em 2.5em 0 0em var(--DOT_2),
        -1.8em 1.8em 0 0em var(--DOT_1), -2.6em 0em 0 0em var(--DOT_4),
        -1.8em -1.8em 0 0em var(--DOT_4);
    }
    75% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_4), 1.8em -1.8em 0 0em var(--DOT_4),
        2.5em 0em 0 0em var(--DOT_4), 1.75em 1.75em 0 0em var(--DOT_4), 0em 2.5em 0 0em var(--DOT_3),
        -1.8em 1.8em 0 0em var(--DOT_2), -2.6em 0em 0 0em var(--DOT_1),
        -1.8em -1.8em 0 0em var(--DOT_4);
    }
    87.5% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_4), 1.8em -1.8em 0 0em var(--DOT_4),
        2.5em 0em 0 0em var(--DOT_4), 1.75em 1.75em 0 0em var(--DOT_4), 0em 2.5em 0 0em var(--DOT_4),
        -1.8em 1.8em 0 0em var(--DOT_3), -2.6em 0em 0 0em var(--DOT_2),
        -1.8em -1.8em 0 0em var(--DOT_1);
    }
  }
  @keyframes load {
    0%,
    100% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_1), 1.8em -1.8em 0 0em var(--DOT_4),
        2.5em 0em 0 0em var(--DOT_4), 1.75em 1.75em 0 0em var(--DOT_4), 0em 2.5em 0 0em var(--DOT_4),
        -1.8em 1.8em 0 0em var(--DOT_4), -2.6em 0em 0 0em var(--DOT_3),
        -1.8em -1.8em 0 0em var(--DOT_2);
    }
    12.5% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_2), 1.8em -1.8em 0 0em var(--DOT_1),
        2.5em 0em 0 0em var(--DOT_4), 1.75em 1.75em 0 0em var(--DOT_4), 0em 2.5em 0 0em var(--DOT_4),
        -1.8em 1.8em 0 0em var(--DOT_4), -2.6em 0em 0 0em var(--DOT_4),
        -1.8em -1.8em 0 0em var(--DOT_3);
    }
    25% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_3), 1.8em -1.8em 0 0em var(--DOT_2),
        2.5em 0em 0 0em var(--DOT_1), 1.75em 1.75em 0 0em var(--DOT_4), 0em 2.5em 0 0em var(--DOT_4),
        -1.8em 1.8em 0 0em var(--DOT_4), -2.6em 0em 0 0em var(--DOT_4),
        -1.8em -1.8em 0 0em var(--DOT_4);
    }
    37.5% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_4), 1.8em -1.8em 0 0em var(--DOT_3),
        2.5em 0em 0 0em var(--DOT_2), 1.75em 1.75em 0 0em var(--DOT_1), 0em 2.5em 0 0em var(--DOT_4),
        -1.8em 1.8em 0 0em var(--DOT_4), -2.6em 0em 0 0em var(--DOT_4),
        -1.8em -1.8em 0 0em var(--DOT_4);
    }
    50% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_4), 1.8em -1.8em 0 0em var(--DOT_4),
        2.5em 0em 0 0em var(--DOT_3), 1.75em 1.75em 0 0em var(--DOT_2), 0em 2.5em 0 0em var(--DOT_1),
        -1.8em 1.8em 0 0em var(--DOT_4), -2.6em 0em 0 0em var(--DOT_4),
        -1.8em -1.8em 0 0em var(--DOT_4);
    }
    62.5% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_4), 1.8em -1.8em 0 0em var(--DOT_4),
        2.5em 0em 0 0em var(--DOT_4), 1.75em 1.75em 0 0em var(--DOT_3), 0em 2.5em 0 0em var(--DOT_2),
        -1.8em 1.8em 0 0em var(--DOT_1), -2.6em 0em 0 0em var(--DOT_4),
        -1.8em -1.8em 0 0em var(--DOT_4);
    }
    75% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_4), 1.8em -1.8em 0 0em var(--DOT_4),
        2.5em 0em 0 0em var(--DOT_4), 1.75em 1.75em 0 0em var(--DOT_4), 0em 2.5em 0 0em var(--DOT_3),
        -1.8em 1.8em 0 0em var(--DOT_2), -2.6em 0em 0 0em var(--DOT_1),
        -1.8em -1.8em 0 0em var(--DOT_4);
    }
    87.5% {
      box-shadow: 0em -2.6em 0em 0em var(--DOT_4), 1.8em -1.8em 0 0em var(--DOT_4),
        2.5em 0em 0 0em var(--DOT_4), 1.75em 1.75em 0 0em var(--DOT_4), 0em 2.5em 0 0em var(--DOT_4),
        -1.8em 1.8em 0 0em var(--DOT_3), -2.6em 0em 0 0em var(--DOT_2),
        -1.8em -1.8em 0 0em var(--DOT_1);
    }
  }
  `
}