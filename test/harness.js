"use strict";
// Test harness: extracts the pure model functions from index.html (single
// self-contained file) WITHOUT modifying it, and evaluates them in a Node vm
// sandbox with no DOM. See test/*.test.js. Run with: node --test
//
// We pull out the named function sources by brace-matching and re-evaluate just
// those (plus the GRAV/D2R constants) in an isolated context. Nothing that
// touches `document`/`window` is included, so no DOM is needed.

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const INDEX_PATH = path.join(__dirname, "..", "index.html");

function readScript() {
  const html = fs.readFileSync(INDEX_PATH, "utf8");
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error("could not find <script> block in index.html");
  return m[1];
}

// Extract a top-level `function NAME(...) { ... }` declaration by brace matching.
function extractFunction(src, name) {
  const re = new RegExp("function\\s+" + name + "\\s*\\(", "g");
  const m = re.exec(src);
  if (!m) throw new Error("function not found in index.html: " + name);
  const start = m.index;
  // find the opening brace of the body
  let i = src.indexOf("{", re.lastIndex);
  if (i < 0) throw new Error("no body for function: " + name);
  let depth = 0;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error("unbalanced braces for function: " + name);
}

// Extract a top-level `const NAME = ...;` declaration (single line).
function extractConst(src, name) {
  const re = new RegExp("const\\s+" + name + "\\s*=\\s*[^;]+;");
  const m = src.match(re);
  if (!m) throw new Error("const not found in index.html: " + name);
  return m[0];
}

const PURE_FUNCTIONS = [
  "sashPoint",
  "leverArm",
  "strutLength",
  "requiredForceTotal",
  "forceTotalAt",
  "optBounds",
  "clampVars",
  "makeObjective",
  "nelderMead",
  "gridSweep",
  "sample",
];

const CONSTS = ["GRAV", "D2R"];

function loadModel() {
  const src = readScript();
  const pieces = [];
  for (const c of CONSTS) pieces.push(extractConst(src, c));
  const fnSources = {};
  for (const fn of PURE_FUNCTIONS) {
    const s = extractFunction(src, fn);
    fnSources[fn] = s;
    pieces.push(s);
  }
  const exportList = PURE_FUNCTIONS.concat(CONSTS).join(", ");
  pieces.push("module.exports = { " + exportList + " };");

  const moduleObj = { exports: {} };
  const sandbox = { module: moduleObj, Math, isFinite, Infinity, NaN };
  vm.createContext(sandbox);
  vm.runInContext('"use strict";\n' + pieces.join("\n\n"), sandbox, {
    filename: "index.html#script",
  });
  return { model: moduleObj.exports, fnSources, scriptSrc: src };
}

module.exports = { loadModel, extractFunction, readScript, INDEX_PATH };
