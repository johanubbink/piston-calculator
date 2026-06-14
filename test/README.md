# Tests — piston-calculator

Unit tests for the physics/math in `../index.html`.

## Run

```sh
node --test
```

(Node 18+; no dependencies, no build.)

## How it works

`index.html` stays a single self-contained file. `harness.js` reads it as text,
extracts the pure model functions (`sashPoint`, `leverArm`, `strutLength`,
`requiredForceTotal`, `gasForce`, `forceTotalAt`, optimizer helpers, `sample`)
by brace-matching, and evaluates just those in a `node:vm` sandbox — no DOM.
`extraction.test.js` guards that the extracted sources still appear verbatim in
`index.html`, so the tests cannot drift from the real code.

## Coverage

- `geometry.test.js` — sashPoint angles & radius invariance, strutLength, leverArm sign/value.
- `force.test.js` — gravity torque → 0 at closed, linearity in W and d, monotonic 0°→90°,
  per-strut = total/2, gasForce endpoints/monotonicity/linearity (K=1.4),
  forceTotalAt finite at the singular closed position, and a fully analytic h(θ) case.
- `optimizer.test.js` — makeObjective discrimination, bounds/clamp, full grid+Nelder–Mead
  optimization yields a feasible result in a plausible per-strut force range.
