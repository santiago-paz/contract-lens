/**
 * Values the hero's timeline writes and the ruler field reads on every frame.
 * They change sixty times a second while a tween runs, so they live in a plain
 * object and not in React state.
 *
 * `sweep` is a band that travels along the ruler while the software reads: 0 is
 * the left edge, 1 the right, and -1 means off. `pulse` is the ring that spreads
 * from the middle when the reading is done: 0 to 1, and -1 means off.
 */
export const rulerState = {
  sweep: -1,
  pulse: -1,
};
