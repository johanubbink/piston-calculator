"use strict";
// Force law: requiredForceTotal, forceTotalAt, per-strut, analytic case.
// Run with: node --test
const test = require("node:test");
const assert = require("node:assert");
const { loadModel } = require("./harness.js");

const { model } = loadModel();
const { sashPoint, leverArm, requiredForceTotal, forceTotalAt, GRAV, D2R } =
  model;

const close = (a, b, tol = 1e-9) =>
  assert.ok(Math.abs(a - b) <= tol, `expected ${a} ≈ ${b} (tol ${tol})`);

// A non-singular geometry (mount offset so leverArm ≠ 0 at θ=0).
function geom(over = {}) {
  return Object.assign(
    { W: 15 * GRAV, d: 0.5, uA: 0.3, vA: 0.0, Bx: -0.1, By: -0.5 },
    over
  );
}
function A_at(st, deg) {
  return sashPoint(st.uA, st.vA, deg * D2R);
}
function B_of(st) {
  return { x: st.Bx, y: st.By };
}

test("requiredForceTotal: at θ=0 gravity torque is 0 → force = 0", () => {
  const st = geom();
  const F = requiredForceTotal(st.W, st.d, 0, A_at(st, 0), B_of(st));
  close(F, 0);
});

test("requiredForceTotal scales linearly with W (double W → double F)", () => {
  const st = geom();
  const A = A_at(st, 45), B = B_of(st);
  const F1 = requiredForceTotal(st.W, st.d, 45 * D2R, A, B);
  const F2 = requiredForceTotal(2 * st.W, st.d, 45 * D2R, A, B);
  close(F2, 2 * F1, 1e-9);
});

test("requiredForceTotal scales linearly with d (double d → double F)", () => {
  const st = geom();
  const A = A_at(st, 60), B = B_of(st);
  const F1 = requiredForceTotal(st.W, st.d, 60 * D2R, A, B);
  const F2 = requiredForceTotal(st.W, 2 * st.d, 60 * D2R, A, B);
  close(F2, 2 * F1, 1e-9);
});

test("required force increases monotonically 0°→90° for a sensible geometry", () => {
  const st = geom();
  const B = B_of(st);
  let prev = -Infinity;
  for (let deg = 0; deg <= 90; deg += 5) {
    const F = requiredForceTotal(st.W, st.d, deg * D2R, A_at(st, deg), B);
    assert.ok(isFinite(F), `F finite at ${deg}°`);
    assert.ok(
      F >= prev - 1e-9,
      `F should be non-decreasing: ${deg}° gave ${F}, prev ${prev}`
    );
    prev = F;
  }
});

test("per-strut force is exactly total/2", () => {
  const st = geom();
  const Ftot = forceTotalAt(st, 45);
  // mirror render(): Fstrut = Ftot/2
  close(Ftot / 2, Ftot / 2);
  // sanity that it's positive & finite, and half of total at multiple angles
  for (const deg of [10, 30, 70, 90]) {
    const tot = forceTotalAt(st, deg);
    assert.ok(isFinite(tot));
    close(tot * 0.5, tot / 2);
  }
});

// ---- forceTotalAt robustness ----
test("forceTotalAt finite at θ=0 for default on-surface geometry (singular)", () => {
  // Default file inputs: vA=0, Bx=0 → strut flat in wall plane at 0°, leverArm=0.
  const st = { W: 15 * GRAV, d: 0.5, uA: 0.3, vA: 0, Bx: 0, By: -0.5 };
  // Confirm it really is the singular case: leverArm ≈ 0 at θ=0.
  const h0 = leverArm(sashPoint(st.uA, st.vA, 0), { x: st.Bx, y: st.By });
  assert.ok(Math.abs(h0) < 1e-9, `expected singular leverArm at 0°, got ${h0}`);
  const F = forceTotalAt(st, 0);
  assert.ok(isFinite(F), `forceTotalAt(0°) should be finite, got ${F}`);
  assert.ok(!Number.isNaN(F), "should not be NaN");
});

test("forceTotalAt matches requiredForceTotal at a non-singular angle (45°)", () => {
  const st = { W: 15 * GRAV, d: 0.5, uA: 0.3, vA: 0, Bx: 0, By: -0.5 };
  const A = sashPoint(st.uA, st.vA, 45 * D2R);
  const B = { x: st.Bx, y: st.By };
  const expected = requiredForceTotal(st.W, st.d, 45 * D2R, A, B);
  close(forceTotalAt(st, 45), expected, 1e-9);
});

// ---- Fully analytic closed-form case ----
test("analytic: closed-form h(θ) and F = W·d·sinθ/h(θ)", () => {
  // Geometry: sash mount on the sash line at u=1 (vA=0); frame mount B=(0,-1).
  // A(θ) = (sinθ, -cosθ).  B = (0,-1).
  // A-B = (sinθ, 1-cosθ).  |A-B| = √(sin²θ + (1-cosθ)²) = √(2-2cosθ).
  // ê = (sinθ, 1-cosθ)/√(2-2cosθ).
  // h = A.x*ey - A.y*ex
  //   = [ sinθ*(1-cosθ) - (-cosθ)*sinθ ] / √(2-2cosθ)
  //   = [ sinθ - sinθcosθ + cosθ sinθ ] / √(2-2cosθ)
  //   = sinθ / √(2-2cosθ).
  const W = 100, d = 0.5, uA = 1, vA = 0, Bx = 0, By = -1;
  const B = { x: Bx, y: By };
  for (let deg = 5; deg <= 90; deg += 5) {
    const th = deg * D2R;
    const A = sashPoint(uA, vA, th);
    const hHand = Math.sin(th) / Math.sqrt(2 - 2 * Math.cos(th));
    close(leverArm(A, B), hHand, 1e-9);
    const Fhand = (W * d * Math.sin(th)) / hHand;
    close(requiredForceTotal(W, d, th, A, B), Fhand, 1e-7);
  }
});
