import { P5CanvasInstance } from '@p5-wrapper/react';

/**
 * Combines two intensity layers into a single `size` x `size` matrix of numbers.
 * the two layers are then blended together weighted by `combinationLayer`
 * (`layer1` when the weight is 1, `layer2` when it is 0).
 */
export const combineLayers = (
    p5: P5CanvasInstance,
    size: number,
    layer1: number[][],
    layer2: number[][],
    combinationLayer: number[][],
) => {

    const resultLayer: number[][] = new Array(size);
    for (let i = 0; i < size; i++) {
        resultLayer[i] = new Array(size);
    }

    for (let x = 0; x < size; x += 1) {
        for (let y = 0; y < size; y += 1) {
            // Blend the two colored layers weighted by the combination layer.
            resultLayer[x][y] = combinationLayer[x][y] * layer1[x][y] + (1 - combinationLayer[x][y] * layer2[x][y]);
        }
    }

    return resultLayer;
};
