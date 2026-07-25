import { P5CanvasInstance } from '@p5-wrapper/react';

/**
 * Multiplies a color layer by a grayscale scalar layer: each pixel's color has
 * its brightness scaled by the corresponding `multiplicationLayer` value (in
 * [0, 1]), e.g. to apply a lighting/shadow pass. Returns a `size` x `size`
 * matrix of colors.
 */
export const multiplyLayers = (
    p5: P5CanvasInstance,
    size: number,
    layer: number[][],
    multiplicationLayer: number[][],
) => {
    const resultLayer: number[][] = new Array(size);
    for (let i = 0; i < size; i++) {
        resultLayer[i] = new Array(size);
    }

    for (let x = 0; x < size; x += 1) {
        for (let y = 0; y < size; y += 1) {
            // Scale the color's brightness by the scalar value.
            resultLayer[x][y] = layer[x][y] * multiplicationLayer[x][y];
        }
    }

    return resultLayer;
};
