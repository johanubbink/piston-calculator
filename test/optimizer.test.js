"use strict";
// Optimizer sanity: makeObjective discrimination + full optimize on defaults.
// Mirrors runOptimizer() in index.html (gridSweep + multi-start Nelder–Mead).
// Run with: node --test
const test = require("node:test");
const assert = require("node:assert");
const { loadModel } = require("./harness.js");

const { model } = loadModel();
const {
  sashPoint,
  leverArm,
  strutLength,
  forceTotalAt,
  optBounds,
  clampVars,
  makeObjective,
  nelderMead,
  gridSweep,
  sample,
  GRAV,
  D2R,
} = model;

// Default inputs from index.html (mm → metres for lengths; angles in deg).
function defaultState() {
  const H = 1000,
    m = 15;
  return {
    H,
    m,
    d: H / 2,
    W: m * GRAV,
    thmax: 90,
    thstar: 90,
    Lmin: 200,
    Lmax: 590,
    uA: 300,
    By: -500,
    vA: 0,
    Bx: 0,
  };
}

test("makeObjective: good geometry scores lower than near-over-centre one", () => {
  const st = defaultState();
  const bounds = optBounds(st);
  const f = makeObjective(st, bounds);
  // Good: a healthy sash mount partway down, frame mount well below the hinge.
  const good = [300, -500];
  // Bad: mount very close to hinge + frame mount near the hinge → tiny/negative
  // lever arm → near over-centre, heavily penalised.
  const bad = [60, -20];
  const fg = f(good);
  const fb = f(bad);
  assert.ok(
    fg < fb,
    `expected good objective ${fg} < bad objective ${fb}`
  );
});

test("optBounds within-bounds variables incur no boundary penalty term", () => {
  const st = defaultState();
  const bounds = optBounds(st);
  // bounds = [[0.05H, H], [-H, 0.20H]] = [[50,1000],[-1000,200]]
  // Compare element-wise: arrays may cross the vm realm boundary, and
  // deepStrictEqual enforces same-realm prototype identity even when contents match.
  const eqArr = (a, b) => {
    assert.strictEqual(a.length, b.length);
    for (let i = 0; i < b.length; i++) assert.strictEqual(a[i], b[i]);
  };
  eqArr(bounds[0], [50, 1000]);
  eqArr(bounds[1], [-1000, 200]);
  // clampVars keeps in-range values unchanged and clamps out-of-range
  eqArr(clampVars([300, -500], bounds), [300, -500]);
  eqArr(clampVars([2000, 999], bounds), [1000, 200]);
  eqArr(clampVars([-5, -5000], bounds), [50, -1000]);
});

// Reproduce runOptimizer()'s search and check feasibility of the result.
function optimize(st) {
  const bounds = optBounds(st);
  const f = makeObjective(st, bounds);
  const seeds = gridSweep(f, bounds, 25, 6);
  const steps = bounds.map(() => st.H * 0.05);
  let res = null;
  for (const seed of seeds) {
    let r = nelderMead(f, seed.x, steps, 400);
    r = nelderMead(f, r.x, steps.map((s) => s / 4), 200);
    if (!res || r.f < res.f) res = r;
  }
  return clampVars(res.x, bounds);
}

test("optimizer on default inputs yields a feasible result in a plausible range", () => {
  const st = defaultState();
  const v = optimize(st);
  st.uA = v[0];
  st.By = v[1];

  const data = sample(st, 90).filter((p) => p.deg > 0.01);
  // length within [Lmin, Lmax] across travel
  const lenOk = data.every(
    (p) => p.L >= st.Lmin - 0.5 && p.L <= st.Lmax + 0.5
  );
  // lever arm > 0 across θ ∈ (0, 90°]
  const hOk = data.every((p) => p.h > 0);
  assert.ok(hOk, "lever arm must stay positive across travel");
  assert.ok(lenOk, "strut length must stay within [Lmin,Lmax] across travel");

  const Ftgt = forceTotalAt(st, st.thstar) / 2;
  assert.ok(
    Ftgt > 120 && Ftgt < 150,
    `force/strut at θ* should be ~120–150 N, got ${Ftgt.toFixed(1)}`
  );
});
