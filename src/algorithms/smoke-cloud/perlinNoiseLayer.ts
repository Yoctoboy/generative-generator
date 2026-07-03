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
    density: number = 0.01,
    octaves: number = 2,
    falloff: number = 0.5,
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
            perlinLayer[x][y] = p5.noise(x * density, y * density);
        }
    }

    return perlinLayer;
};
