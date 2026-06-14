"use strict";
// Guard: confirm the harness really extracts the live functions from index.html
// (not a copied fixture), so tests can't silently drift from the real code.
// Run with: node --test
const test = require("node:test");
const assert = require("node:assert");
const { loadModel, readScript } = require("./harness.js");

test("all pure model functions are extracted as live functions", () => {
  const { model } = loadModel();
  const names = [
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
  for (const n of names) {
    assert.strictEqual(typeof model[n], "function", `${n} should be a function`);
  }
  assert.strictEqual(model.GRAV, 9.81);
  assert.ok(Math.abs(model.D2R - Math.PI / 180) < 1e-15);
});

test("extracted function source matches the text in index.html verbatim", () => {
  const { fnSources } = loadModel();
  const script = readScript();
  for (const [name, src] of Object.entries(fnSources)) {
    assert.ok(
      script.includes(src),
      `extracted source for ${name} must appear verbatim in index.html`
    );
  }
});
