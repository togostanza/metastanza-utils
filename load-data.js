import * as d3 from "d3";

async function showLoadingIcon(element) {
  if (element.offsetHeight < 30) {
    d3.select(element).transition().duration(100).style("min-height", "30px");
  }

  const main = d3.select(element)
    .classed("main-center", true)

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

function hideLoadingIcon(element) {
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
      await showLoadingIcon(mainElement);
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 500));
        // ...do some async work...
      }
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
