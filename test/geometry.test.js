"use strict";
// Geometry: sashPoint, leverArm, strutLength.
// Run with: node --test
const test = require("node:test");
const assert = require("node:assert");
const { loadModel } = require("./harness.js");

const { model, D2R } = (() => {
  const m = loadModel();
  return { model: m.model, D2R: m.model.D2R };
})();
const { sashPoint, leverArm, strutLength } = model;

const close = (a, b, tol = 1e-9) =>
  assert.ok(Math.abs(a - b) <= tol, `expected ${a} ≈ ${b} (tol ${tol})`);

test("sashPoint at θ=0 (closed, sash hangs down) → (v, -u)", () => {
  const p = sashPoint(0.3, 0.05, 0);
  close(p.x, 0.05); // v
  close(p.y, -0.3); // -u
});

test("sashPoint at θ=90° (horizontal) → (u, v)", () => {
  const p = sashPoint(0.3, 0.05, 90 * D2R);
  close(p.x, 0.3); // u
  close(p.y, 0.05); // v
});

test("sashPoint: a fixed point keeps radius √(u²+v²) for all θ", () => {
  const u = 0.42, v = 0.13;
  const r = Math.hypot(u, v);
  for (let deg = 0; deg <= 180; deg += 7) {
    const p = sashPoint(u, v, deg * D2R);
    close(Math.hypot(p.x, p.y), r, 1e-12);
  }
});

test("sashPoint with v=0 lies on the sash line, radius = u", () => {
  for (let deg = 0; deg <= 90; deg += 15) {
    const p = sashPoint(0.7, 0, deg * D2R);
    close(Math.hypot(p.x, p.y), 0.7, 1e-12);
  }
});

test("strutLength is plain Euclidean distance", () => {
  close(strutLength({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
  close(strutLength({ x: 1, y: 1 }, { x: 1, y: 1 }), 0);
  close(strutLength({ x: -2, y: 0 }, { x: 1, y: 4 }), 5);
});

test("leverArm: hand-checkable horizontal strut below a point", () => {
  // A at (1,0); B at (-1,0). ê = (A-B)/|A-B| = (1,0).
  // leverArm = A.x*ey - A.y*ex = 1*0 - 0*1 = 0  (line of action passes through hinge plane y=0... actually through origin)
  close(leverArm({ x: 1, y: 0 }, { x: -1, y: 0 }), 0);
});

test("leverArm: vertical strut offset in x gives perpendicular distance", () => {
  // A=(2,1), B=(2,-1): ê = (0,1). leverArm = A.x*1 - A.y*0 = 2.
  close(leverArm({ x: 2, y: 1 }, { x: 2, y: -1 }), 2);
  // reversing the offset sign flips the leverArm sign
  close(leverArm({ x: -2, y: 1 }, { x: -2, y: -1 }), -2);
});

test("leverArm sign: matches 2D cross product r_A × ê", () => {
  const A = { x: 0.3, y: -0.2 }, B = { x: 0, y: -0.5 };
  const dx = A.x - B.x, dy = A.y - B.y, L = Math.hypot(dx, dy);
  const expected = A.x * (dy / L) - A.y * (dx / L);
  close(leverArm(A, B), expected, 1e-12);
});
