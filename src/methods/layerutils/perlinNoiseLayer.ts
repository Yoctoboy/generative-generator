import { P5CanvasInstance } from '@p5-wrapper/react';

/**
 * Generates a `size` x `size` matrix filled with Perlin noise.
 * `density` controls how "zoomed in" the noise is: higher values pack more
 * detail into the same area (i.e. the sampling step between adjacent cells).
 * Returned values are real numbers between 0 and 1.
 */
export const generatePerlinNoiseLayer = (
    p5: P5CanvasInstance,
    size: number,
    density: number = 0.004,
    octaves: number = 3,
    falloff: number = 0.4,
) => {
    // Fewer octaves / lower falloff => smoother noise with less fine grain.
    p5.noiseDetail(octaves, falloff);

    const perlinLayer = new Array(size);
    for (let i = 0; i < size; i++) {
        perlinLayer[i] = new Array(size);
    }

    for (let x = 0; x < size; x += 1) {
        for (let y = 0; y < size; y += 1) {
            // p5.noise returns a value in [0, 1]
            const warp = 80;
            const nx = x * density;
            const ny = y * density;

            const qx = p5.noise(nx + 100, ny + 100) * warp;
            const qy = p5.noise(nx - 100, ny - 100) * warp;

            const val = p5.noise((x + qx) * density, (y + qy) * density);
            // const val = p5.noise(x * density, y * density);
            const gamma = 2;
            // perlinLayer[x][y] = val * 255;
            perlinLayer[x][y] = Math.pow(val, gamma) / (Math.pow(val, gamma) + Math.pow(1-val, gamma));
        }
    }

    return perlinLayer;
};
