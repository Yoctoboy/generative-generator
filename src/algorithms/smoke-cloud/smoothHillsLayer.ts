import { P5CanvasInstance } from '@p5-wrapper/react';

/**
 * Generates a `size` x `size` matrix filled with smooth ish noise.
 * `density` controls how "zoomed in" the noise is: higher values pack more
 * detail into the same area (i.e. the sampling step between adjacent cells).
 * Returned values are real numbers between 0 and 1.
 */
export const generateSmoothHillsLayer = (
    p5: P5CanvasInstance,
    size: number,
    seedsAmount: number = 100, // amount chosen points
) => {
    const out = Array.from({ length: size }, () => new Array<number>(size));
    const eps = 3;
    const seeds = Array.from({ length: seedsAmount }).map(() => ({
        color: p5.random(0.2, 0.8),
        x: Math.floor(p5.random(0, size)),
        y: Math.floor(p5.random(0, size)),
    }));

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            let wf = 0,
                wsum = 0;

            for (const s of seeds) {
                const dx = x - s.x;
                const dy = y - s.y;
                const d = Math.hypot(dx, dy);
                // if exactly on a seed -> take its color
                const w = d < eps ? 1 : 1 / Math.pow(d + eps, 1.1);
                wf += w * s.color;
                wsum += w;
            }

            if (wsum >= 0) {
                const val = wf / wsum;
                const gamma = 4;
                out[x][y] = Math.pow(val, gamma) / (Math.pow(val, gamma) + Math.pow(1-val, gamma));
            }
        }
    }
    return out;
};
