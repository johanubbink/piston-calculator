"""
Standalone illustration (not part of the web app):
Why mounting at (u_A=800, B_y=-100) gives the SAME force as (u_A=100, B_y=-800).

Both reduce to a triangle hinged at O with legs |OA|=u_A and |OB|=|B_y| and included
angle theta. Swapping the two legs gives a congruent (mirror-image) triangle, so the
strut length L, the lever arm h, and the required force F are identical at every angle.
"""
import numpy as np
import matplotlib.pyplot as plt

G = 9.81
W = 15 * G        # window weight, N  (15 kg)
d = 500.0         # CoM distance from hinge, mm (uniform sash, H/2)

# the two configurations: (u_A, B_y)   [mm]
configs = [
    dict(uA=800, By=-100, color="#c1452a", label="u_A=800, B_y=-100"),
    dict(uA=100, By=-800, color="#2c5a86", label="u_A=100, B_y=-800"),
]

def geom(uA, By, th):
    """th in radians. Returns (A, B, L, h, F_per_strut)."""
    A = np.array([uA * np.sin(th), -uA * np.cos(th)])
    B = np.array([0.0, By])
    L = np.hypot(*(A - B))
    # lever arm h = perpendicular dist hinge->strut line = u_A*|B_y|*sin(th)/L
    h = -uA * By * np.sin(th) / L          # By<0 => positive
    F_total = W * d * L / (uA * abs(By))   # closed form (no 0/0); = W d sin/h
    return A, B, L, h, F_total / 2.0

th_deg = np.linspace(0, 90, 181)
th = np.radians(th_deg)

fig = plt.figure(figsize=(12, 8))
fig.suptitle("Mount symmetry: swapping the two distances leaves the force unchanged",
             fontsize=14, fontweight="bold")

# ---- (1) Force per strut vs angle ----
ax1 = fig.add_subplot(2, 2, 1)
for i, c in enumerate(configs):
    F = np.array([geom(c["uA"], c["By"], t)[4] for t in th])
    if i == 0:
        ax1.plot(th_deg, F, color=c["color"], lw=2.5, label=c["label"])
    else:  # markers so the exact overlap is visible
        ax1.plot(th_deg[::10], F[::10], "o", color=c["color"], ms=6,
                 mfc="none", mew=1.6, label=c["label"] + " (overlaps)")
ax1.set_xlabel("opening angle  θ  (deg)")
ax1.set_ylabel("force per strut  (N)")
ax1.set_title("Force per strut  —  curves coincide")
ax1.grid(alpha=.3); ax1.legend(); ax1.set_xlim(0, 90)

# ---- (2) Lever arm h vs angle ----
ax2 = fig.add_subplot(2, 2, 3)
for i, c in enumerate(configs):
    h = np.array([geom(c["uA"], c["By"], t)[3] for t in th])
    if i == 0:
        ax2.plot(th_deg, h, color=c["color"], lw=2.5, label=c["label"])
    else:
        ax2.plot(th_deg[::10], h[::10], "o", color=c["color"], ms=6,
                 mfc="none", mew=1.6, label=c["label"] + " (overlaps)")
ax2.set_xlabel("opening angle  θ  (deg)")
ax2.set_ylabel("lever arm  h  (mm)")
ax2.set_title("Lever arm  —  identical")
ax2.grid(alpha=.3); ax2.legend(); ax2.set_xlim(0, 90)

# ---- (3) Strut length L vs angle ----
ax3 = fig.add_subplot(2, 2, 4)
for i, c in enumerate(configs):
    L = np.array([geom(c["uA"], c["By"], t)[2] for t in th])
    if i == 0:
        ax3.plot(th_deg, L, color=c["color"], lw=2.5, label=c["label"])
    else:
        ax3.plot(th_deg[::10], L[::10], "o", color=c["color"], ms=6,
                 mfc="none", mew=1.6, label=c["label"] + " (overlaps)")
ax3.set_xlabel("opening angle  θ  (deg)")
ax3.set_ylabel("strut length  L  (mm)")
ax3.set_title("Strut length  —  identical")
ax3.grid(alpha=.3); ax3.legend(); ax3.set_xlim(0, 90)

# ---- (4) Geometry at theta = 60 deg: the two congruent triangles ----
axg = fig.add_subplot(2, 2, 2)
t0 = np.radians(60)
axg.set_title("Geometry at θ = 60°  —  reflected triangles (hinge O)")
# wall (down the y axis) and a marker for the hinge
axg.axvline(0, color="#888", lw=1)
axg.plot(0, 0, "ks", ms=7); axg.annotate("O (hinge)", (0, 0), textcoords="offset points",
                                          xytext=(8, 6), fontsize=9)
for c in configs:
    A, B, L, h, F = geom(c["uA"], c["By"], t0)
    # triangle O-A-B
    axg.plot([0, A[0], B[0], 0], [0, A[1], B[1], 0], color=c["color"], lw=2)
    axg.plot(*A, "o", color=c["color"]); axg.plot(*B, "o", color=c["color"])
    axg.annotate(f"A ({c['uA']})", A, textcoords="offset points", xytext=(6, 4),
                 fontsize=8, color=c["color"])
    axg.annotate(f"B ({abs(c['By'])})", B, textcoords="offset points", xytext=(6, -10),
                 fontsize=8, color=c["color"])
axg.set_aspect("equal"); axg.grid(alpha=.3)
axg.set_xlabel("x  (mm, outward)"); axg.set_ylabel("y  (mm, up)")

# annotation of the key identity
F90 = geom(800, -100, np.radians(90))[4]
fig.text(0.5, 0.005,
         f"u_A·|B_y| = 80000 for both  →  F(θ) = W·d·L(θ)/(u_A·|B_y|) is identical.   "
         f"e.g. force/strut at 90° = {F90:.1f} N for both.",
         ha="center", fontsize=10)

plt.tight_layout(rect=[0, 0.03, 1, 0.96])
out = "mount_symmetry.png"
plt.savefig(out, dpi=130)
print("saved", out)
