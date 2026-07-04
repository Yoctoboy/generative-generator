import { P5CanvasInstance } from '@p5-wrapper/react';

/**
 * Generates a `size` x `size` matrix filled with a simple 2-D gradient.
 * Returned values are real numbers between 0 and 1.
 */
export const generateLightLayer = (p5: P5CanvasInstance, size: number) => {
    // Random gradient angle over the full circle, so the dark edge can fall on
    // any side of the image.
    const angle = p5.radians(p5.random(0, 360));
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    // Project the 4 corners to find the range of projected values, so we can
    // normalize the gradient into [0, 1].
    const projection = (x: number, y: number) => x * dx + y * dy;
    const max = size - 1;
    const projections = [
        projection(0, 0),
        projection(max, 0),
        projection(0, max),
        projection(max, max),
    ];
    const minProj = Math.min(...projections);
    const maxProj = Math.max(...projections);

    // The gradient ramps up from a point somewhere below the top of the canvas.
    // Everything above that point stays at 0, and it still reaches 1 at the
    // other end of the image. `start` is the fraction of the projection range at 
    // which the ramp begins (0 = very top, 0.4 = 40% down).
    const start = p5.random(-0.3, 0.4);
    const startProj = minProj + start * (maxProj - minProj);
    const range = maxProj - startProj;
    p5.noiseDetail(2, 0.5);
    const lightLayer = new Array(size);
    for (let x = 0; x < size; x++) {
        lightLayer[x] = new Array(size);
        for (let y = 0; y < size; y++) {
            const value = (projection(x, y) - startProj) / range;
            lightLayer[x][y] = Math.min(
                1,
                Math.max(0, value) + 0.1 * p5.random(x * 0.0001, y * 0.0001) - 0.1,
            );
        }
    }

    return lightLayer;
};
