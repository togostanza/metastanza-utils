import * as d3 from "d3";
import { stringify as csvStringify } from "csv-stringify/browser/esm/sync";
import { format as formatDate } from "date-fns";

async function downloadImg(_svg, format, filename, root) {
  let url, img, canvas, context;
  const pngZoom = 2; // png resolution rate
  const svg = d3.select(_svg);

  svg.attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg");

  let style = "";
  if (root.host && root.querySelector("style")) {
    style += root
      .querySelector("style")
      .innerHTML.replace(/[\r\n]/g, "")
      .match(/^\s*:host\s*{(.+)}\s*$/)[1];
  }

  for (let styleSheet of document.styleSheets) {
    if (styleSheet.cssRules[0].selectorText === root.host.nodeName.toLowerCase()){
      style += styleSheet.cssRules[0].cssText.split("{")[1].split("}")[0]
    }
  }

  let link_style = "";
  const link = root.querySelector("link[rel='stylesheet']");
  if (link) {
    const css = await fetch(link.getAttribute("href")).then((res) =>
      res.text()
    );
    link_style = css.replace(/[\r\n]/g, "");
  }

  const tmp = svg.node().outerHTML.match(/^([^>]+>)([\s\S]+)$/);
  const string =
    tmp[1] + "<style>svg{" + style + "}" + link_style + "</style>" + tmp[2];
  const w = parseInt(svg.style("width"));
  const h = parseInt(svg.style("height"));

  // downloading function
  const aLinkClickDL = function () {
    if (format === "png") {
      context.drawImage(img, 0, 0, w, h, 0, 0, w * pngZoom, h * pngZoom);
      url = canvas.node().toDataURL("image/png");
    }

    const a = d3.select("body").append("a");
    a.attr("class", "downloadLink")
      .attr("download", filename)
      .attr("href", url)
      .text("test")
      .style("display", "none");

    a.node().click();

    setTimeout(function () {
      window.URL.revokeObjectURL(url);
      if (format === "png") {
        canvas.remove();
      }
      a.remove();
    }, 10);
  };

  if (format === "svg") {
    // SVG
    filename += ".svg";
    const blobObject = new Blob([string], {
      type: "data:image/svg+xml;base64",
    });
    url = window.URL.createObjectURL(blobObject);
    aLinkClickDL();
  } else if (format === "png") {
    // PNG
    console.log(string);
    filename += ".png";
    img = new Image();
    img.src = "data:image/svg+xml;utf8," + encodeURIComponent(string);
    img.addEventListener("load", aLinkClickDL, false);

    canvas = d3
      .select("body")
      .append("canvas")
      .attr("width", w * pngZoom)
      .attr("height", h * pngZoom)
      .style("display", "none");
    context = canvas.node().getContext("2d");
  }
}

function filenameWithTimestamp(prefix) {
  return prefix + "-" + formatDate(new Date(), "yyyyMMdd-HHmmss");
}

export function dividerMenuItem() {
  return { type: "divider" };
}

export function downloadSvgMenuItem(stanza, filenamePrefix) {
  return {
    type: "item",
    label: "Download SVG",
    handler: () => {
      downloadImg(
        stanza.root.querySelector("svg"),
        "svg",
        filenameWithTimestamp(filenamePrefix),
        stanza.root
      );
    },
  };
}

export function downloadPngMenuItem(stanza, filenamePrefix) {
  return {
    type: "item",
    label: "Download PNG",
    handler: () => {
      downloadImg(
        stanza.root.querySelector("svg"),
        "png",
        filenameWithTimestamp(filenamePrefix),
        stanza.root
      );
    },
  };
}

const downloadBlob = (blob, fileName) => {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export function downloadJSONMenuItem(stanza, filenamePrefix, data) {
  return {
    type: "item",
    label: "Download JSON",
    handler: () => {
      const blob = new Blob([JSON.stringify(data, null, "  ")], {
        type: "application/json",
      });
      downloadBlob(blob, filenameWithTimestamp(filenamePrefix) + ".json");
    },
  };
}

export function downloadCSVMenuItem(stanza, filenamePrefix, data) {
  return {
    type: "item",
    label: "Download CSV",
    handler: () => {
      const csv = csvStringify(data, { header: true, bom: true });
      const blob = new Blob([csv], { type: "text/csv" });
      downloadBlob(blob, filenameWithTimestamp(filenamePrefix) + ".csv");
    },
  };
}

export function downloadTSVMenuItem(stanza, filenamePrefix, data) {
  return {
    type: "item",
    label: "Download TSV",
    handler: () => {
      const tsv = csvStringify(data, {
        header: true,
        bom: true,
        delimiter: "\t",
      });
      const blob = new Blob([tsv], { type: "text/tsv" });
      downloadBlob(blob, filenameWithTimestamp(filenamePrefix) + ".tsv");
    },
  };
}

export function appendCustomCss(stanza, customCssUrl) {
  const links = stanza.root.querySelectorAll(
    "link[data-togostanza-custom-css]"
  );
  for (const link of links) {
    link.remove();
  }

  if (customCssUrl) {
    const link = document.createElement("link");
    stanza.root.appendChild(link);

    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", customCssUrl);
    link.setAttribute("data-togostanza-custom-css", "");
  }
}
