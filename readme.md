# Top‑Hung Window Gas‑Strut — Complete Derivation

How much force must a gas strut (piston) supply to hold a top‑hung window open at a
given angle, and where should it be mounted to minimise that force?

This document derives every equation used by the calculator from first principles.

---

## 1. Problem statement

- A window sash is **hinged along its top edge**, mounted on a **vertical wall**, and
  **opens outward** (the bottom swings out and up).
- It is held by **two symmetric gas struts** (one per side).
- We want the strut force required to hold the sash in static equilibrium at any opening
  angle, and the mounting geometry that minimises it.

Quasi‑static assumption: the window is moved slowly, so at every angle the net torque is
zero (inertia neglected).

---

## 2. Coordinate system and kinematics

Work in the 2‑D plane of one strut, viewed along the hinge axis.

- $x$ — horizontal, pointing **outward** (the swing direction)
- $y$ — vertical, pointing **up**
- Origin $O$ at the **hinge**
- Opening angle $\theta$: $\theta = 0$ closed (sash hangs straight down), $\theta = 90^\circ$ horizontal.

A point fixed on the sash is described in **sash‑local coordinates** $(u, v)$:
$u$ = distance **down the sash** from the hinge, $v$ = perpendicular **outward** offset.
As the sash opens, this point rotates rigidly about $O$:

$$
P(u,v,\theta) \;=\; \big(\,u\sin\theta + v\cos\theta,\;\; -u\cos\theta + v\sin\theta\,\big)
$$

Equivalently $P = u\,\hat{\mathbf s} + v\,\hat{\mathbf n}$, with the unit vectors

$$
\hat{\mathbf s}(\theta) = (\sin\theta,\,-\cos\theta) \quad(\text{down the sash}),
\qquad
\hat{\mathbf n}(\theta) = (\cos\theta,\,\sin\theta) \quad(\hat{\mathbf s}\text{ rotated }+90^\circ).
$$

Checks: $\theta=0 \Rightarrow P=(v,-u)$ (straight down); $\theta=90^\circ \Rightarrow P=(u,v)$
(horizontal outward). The map is a rotation, so $|P| = \sqrt{u^2+v^2}$ for all $\theta$.

---

## 3. Centre of mass (uniform sash)

For a **uniform** rectangular sash of height $H$ and total mass $m$, the centre of mass
sits at mid‑height along the sash and on its centre line:

$$
d = \tfrac{1}{2}H \quad (\text{distance down the sash}), \qquad v_G = 0,
\qquad W = m\,g .
$$

So the centre of mass is at

$$
G(\theta) = P(d, 0, \theta) = (\,d\sin\theta,\; -d\cos\theta\,).
$$

---

## 4. Gravity torque about the hinge (the load)

Gravity acts at $G$ with force $\mathbf w = (0,\,-W)$. Using the 2‑D scalar cross product
$\mathbf a \times \mathbf b = a_x b_y - a_y b_x$, the torque about $O$ is

$$
\tau_g = G_x w_y - G_y w_x = (d\sin\theta)(-W) - (-d\cos\theta)(0)
\;=\; -\,W d \sin\theta .
$$

It is **negative** (clockwise) — a **closing** torque. Cross‑check via potential energy
$U = W\,y_G = -W d\cos\theta$:

$$
\tau_g = -\frac{dU}{d\theta} = -W d\sin\theta. \quad\checkmark
$$

Key feature: the $\sin\theta$ factor is the **horizontal lever** $d\sin\theta$ of the centre
of mass from the hinge. It is **zero when closed** ($\theta=0$, weight hangs directly below
the hinge) and **maximal when horizontal** ($\theta=90^\circ$). A top‑hung window is
therefore hardest to hold **fully open**.

---

## 5. Strut force, line of action, and lever arm

The strut connects a **sash mount** $A$ to a **frame mount** $B$:

$$
A(\theta) = P(u_A, v_A, \theta), \qquad B = (B_x,\,B_y)\ \text{(fixed)} .
$$

A gas strut is a **compression member**: it pushes its endpoints apart, so the force it
applies to the sash at $A$ points **from $B$ toward $A$**, along the unit vector

$$
\hat{\mathbf e} = \frac{A-B}{\lVert A-B\rVert}, \qquad L \equiv \lVert A-B\rVert\ \text{(strut length)} .
$$

With force magnitude $F$, the strut torque about $O$ is

$$
\tau_s = \mathbf r_A \times (F\hat{\mathbf e}) = F\,(A_x \hat e_y - A_y \hat e_x) = F\,h(\theta),
$$

where the **lever arm** (signed perpendicular distance from the hinge to the strut's line
of action) is

$$
\boxed{\,h(\theta) = A_x\hat e_y - A_y\hat e_x = \frac{A_y B_x - A_x B_y}{L}\,}
$$

(This is exactly `leverArm(A, B)` in the code.)

---

## 6. Torque balance → required force

Static equilibrium about the hinge means $\tau_g + \tau_s = 0$:

$$
F\,h(\theta) = W d \sin\theta
\qquad\Longrightarrow\qquad
\boxed{\,F(\theta) = \dfrac{W\,d\,\sin\theta}{h(\theta)}\,}
$$

This is the governing equation (`requiredForceTotal`).

**Sign / validity.** Gravity gives a closing torque ($\tau_g<0$); the strut must give an
opening torque ($\tau_s>0$). With $F>0$ this requires $h(\theta) > 0$. So

$$
h(\theta) > 0 \quad\Longleftrightarrow\quad \text{valid (not over‑centre).}
$$

If $h \le 0$ the strut would have to *pull*, which a compression strut cannot do — the
linkage is **over‑centre**.

**Interpretation.** Force = (how hard gravity pulls it shut) ÷ (how much leverage the strut
has). The numerator $Wd\sin\theta$ peaks at $90^\circ$; the denominator $h(\theta)$ is set
by the mounting geometry. Good mounting makes $h$ large where $\sin\theta$ is large.

---

## 7. Two struts

Two identical struts mounted symmetrically (mirror images) share the in‑plane torque
equally, so each carries half:

$$
F_{\text{per strut}}(\theta) = \tfrac{1}{2}\,F(\theta).
$$

---

## 8. Mounts on the surfaces → the triangle form

In the calculator both mounts lie on real surfaces:

$$
v_A = 0\ \ (\text{sash mount on the window face}), \qquad
B_x = 0\ \ (\text{frame mount in the wall plane}).
$$

Then $A = (u_A\sin\theta,\,-u_A\cos\theta)$ and $B = (0,\,B_y)$. Define the two distances
**from the hinge**:

$$
a \equiv |OA| = u_A, \qquad b \equiv |OB| = |B_y| \quad(B_y<0\ \text{for a mount below the hinge}).
$$

The frame mount lies straight down the wall — the **closed** sash direction — and the sash
has rotated by $\theta$, so the **angle at the hinge between $OA$ and $OB$ is exactly
$\theta$**. The hinge $O$, the sash mount $A$, and the frame mount $B$ form a triangle whose
two legs are $a$ and $b$ with included angle $\theta$, and whose **third side is the strut**.

**Strut length** — law of cosines:

$$
\boxed{\,L(\theta) = \sqrt{a^2 + b^2 - 2ab\cos\theta}\,}
$$

**Lever arm.** The perpendicular distance from a vertex to the opposite side equals
$2\times\text{Area}/L$, and the triangle area is $\tfrac12 ab\sin\theta$:

$$
\boxed{\,h(\theta) = \frac{2\cdot\frac12 ab\sin\theta}{L} = \frac{ab\sin\theta}{L}\,}
$$

(Consistent with §5: $h = -u_A B_y\sin\theta/L = ab\sin\theta/L$ since $B_y=-b$.)

**Force.** Substituting into §6, the $\sin\theta$ cancels:

$$
\boxed{\,F(\theta) = \frac{W d \sin\theta}{h(\theta)} = \frac{W\,d\,L(\theta)}{a\,b}\,}
$$

This closed form has **no singularity** and is convenient for analysis and plotting.

---

## 9. Mount‑swap symmetry

In the triangle form, $F = \dfrac{WdL}{ab}$ with $L^2 = a^2+b^2-2ab\cos\theta$.

Both the product $ab$ **and** $L$ (through $a^2+b^2$ and $ab$) are **symmetric under
$a \leftrightarrow b$**. Therefore

$$
F(\theta)\ \text{is identical when the two mount distances are swapped, at every angle.}
$$

Geometrically, swapping the legs reflects the triangle into a congruent one — same third
side (strut length), same height from the hinge (lever arm), hence same force.

Example: $(u_A, B_y) = (800, -100)$ and $(100, -800)$ both have $ab = 80{,}000$ and give
identical $L$, $h$, $F$ for all $\theta$.

**Caveat — sign matters.** This is a symmetry of the two *distances*, with the frame mount
**below** the hinge ($B_y<0$, included angle $\theta$, $h>0$). Putting the frame mount the
same distance **above** the hinge ($B_y>0$) makes the included angle $180^\circ-\theta$,
flips the sign of the cosine term, sends the strut to the far side of the hinge, and gives
$h<0$ (over‑centre, $F<0$). Such a configuration only coincides in magnitude with its
mirror at $\theta=90^\circ$ (where $\cos\theta=0$) and differs elsewhere.

---

## 10. The closed‑position singularity

With mounts on the surfaces, at $\theta=0$ both $A$ and $B$ lie in the wall plane, so the
strut line passes through the hinge and

$$
h(0) = \frac{ab\sin 0}{L} = 0 .
$$

The governing form $F=Wd\sin\theta/h$ is then $0/0$. But the triangle form is well behaved:

$$
\lim_{\theta\to 0} F(\theta) = \frac{W d\,L(0)}{ab} = \frac{W d\,|a-b|}{ab}\quad(\text{finite}).
$$

Physically: **exactly at closed the strut has zero leverage** and cannot start the window
opening (a latch or hand opens the first degree). The required force **jumps to a finite
value the instant it is cracked open** and stays finite thereafter. The calculator reports
this finite limit by evaluating a hair off $0^\circ$ (`forceTotalAt`), and the optimiser
skips the exact $0^\circ$ sample.

---

## 11. Higher vs. lower on the wall, and the force floor

The peak force occurs at full open ($\theta=90^\circ$), where $\cos\theta = 0$:

$$
L(90^\circ)=\sqrt{a^2+b^2}, \qquad
F(90^\circ) = \frac{W d\sqrt{a^2+b^2}}{ab} = W d\,\sqrt{\frac{1}{a^2}+\frac{1}{b^2}} .
$$

Consequences:

- $F(90^\circ)$ **decreases monotonically as $b$ increases** (frame mount lower on the
  wall) — and likewise as $a$ increases (sash mount further down the sash).
- It approaches a **floor** set by the *other* mount:
  $\displaystyle \lim_{b\to\infty} F(90^\circ) = \frac{Wd}{a}$ (total), i.e. $Wd/(2a)$ per strut.
- Returns **diminish sharply**: once $b\gtrsim a$ you are within ~10–20 % of the floor.
- The practical limit is the strut's **maximum length**, since $L(90^\circ)=\sqrt{a^2+b^2}$
  grows with $b$; you cannot mount lower than $L_{\max}$ allows.

So: **lower is better, with diminishing returns, bounded by $L_{\max}$.** Because the floor
is $Wd/a$, pushing the *sash* mount lower (larger $a$) actually lowers the floor itself and
is often the bigger lever.

---

## 12. Gas‑strut force characteristic (aside)

A gas strut is **not** constant‑force. Compressing the rod reduces the gas volume, raising
pressure and force — so it is **strongest fully compressed, weakest fully extended**
(opposite to a common intuition). A simple linear model with progression factor
$K = F_{\text{compressed}}/F_{\text{extended}} \approx 1.2\text{–}1.7$ is

$$
F_{\text{gas}}(L) = F_1\left[\,1 + (K-1)\,\frac{L_{\max}-L}{L_{\max}-L_{\min}}\right],
$$

giving $F_1$ at full extension ($L=L_{\max}$) and $K F_1$ at full compression
($L=L_{\min}$). A real strut also has a friction hysteresis band (push‑in vs. push‑out
force differ), which is what lets it *hold* steady over a range of angles.

*(This model is documented for completeness; the current calculator reports the required
force only and leaves the strut‑rating comparison to the user.)*

---

## 13. The optimisation problem

Choose the two mounting distances to minimise the holding force at the design angle.

**Decision variables**

$$
u_A \in [\,u_{\min}, u_{\max}\,], \qquad B_y \in [\,B_{y,\min}, B_{y,\max}\,]
\qquad (a=u_A,\ b=|B_y|).
$$

**Objective** — per‑strut force at the design angle $\theta^\*$:

$$
\min_{u_A,\,B_y}\ \ \tfrac12 F(\theta^\*)
= \frac{W\,d\,L(\theta^\*)}{2\,u_A\,|B_y|},
\qquad L(\theta^\*)=\sqrt{u_A^2+B_y^2 - 2u_A|B_y|\cos\theta^\*} .
$$

**Constraints** (enforced across the travel $\theta\in[0,\theta_{\max}]$):

$$
\begin{aligned}
&L_{\min} \le L(\theta) \le L_{\max} &&\text{(strut fits, opens and closes)}\\
&h(\theta) > 0 \quad \forall\,\theta\in(0,\theta_{\max}] &&\text{(no over‑centre)}\\
&\text{mounts within the allowed ranges} &&\text{(on real structure)}
\end{aligned}
$$

**Solution method.** The space is only 2‑D and the objective is smooth but non‑convex with
hard constraints, so the calculator uses a coarse **grid sweep** for good starting points
followed by **multi‑start Nelder–Mead** refinement, with the constraints applied as
penalties (sampling $\theta$ every $\sim\!1^\circ$). Plain JavaScript — fast enough to run
live in the browser; no derivatives or external libraries required.

*Note:* minimising the force at $\theta^\*$ alone can, for some inputs, trade a low force at
$\theta^\*$ for a higher force elsewhere in the travel. The force‑vs‑angle plot reveals this.

---

## Appendix — symbol table

| Symbol | Meaning | Units |
|---|---|---|
| $\theta$ | opening angle (0 closed, 90° horizontal) | deg / rad |
| $\theta^\*$ | design angle (where force is minimised) | deg |
| $H$ | sash height | mm |
| $m,\ W=mg$ | sash mass, weight | kg, N |
| $d=H/2$ | hinge → centre of mass (uniform sash) | mm |
| $u_A,\ v_A$ | sash mount: down‑sash, perpendicular ($v_A=0$) | mm |
| $B_x,\ B_y$ | frame mount world coords ($B_x=0$, $B_y<0$) | mm |
| $a=u_A,\ b=|B_y|$ | mount distances from the hinge | mm |
| $A,\ B$ | sash / frame mount points | mm |
| $L$ | strut length $=\lVert A-B\rVert$ | mm |
| $h$ | lever arm (perp. hinge → strut line) | mm |
| $F$ | total required force; $F/2$ per strut | N |
| $L_{\min},L_{\max}$ | retracted / extended strut length | mm |
| $g=9.81$ | gravitational acceleration | m/s² |

### Master equations

$$
\tau_g = -Wd\sin\theta,\qquad
F(\theta)=\frac{Wd\sin\theta}{h(\theta)},\qquad
h=\frac{A_yB_x-A_xB_y}{L}.
$$

Mounts on the surfaces ($v_A=0,\ B_x=0$, $a=u_A,\ b=|B_y|$):

$$
L=\sqrt{a^2+b^2-2ab\cos\theta},\qquad
h=\frac{ab\sin\theta}{L},\qquad
F=\frac{WdL}{ab},\qquad
F(90^\circ)=Wd\sqrt{\tfrac1{a^2}+\tfrac1{b^2}}.
$$
