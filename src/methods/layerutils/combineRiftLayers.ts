import { P5CanvasInstance } from '@p5-wrapper/react';
import { Color } from 'p5';

/**
 * Combines two intensity layers into a single `size` x `size` matrix of numbers.
 * the two layers are then blended together weighted by `combinationLayer`
 * (`layer1` when the weight is 1, `layer2` when it is 0).
 */
export const combineRiftLayers = (
    p5: P5CanvasInstance,
    size: number,
    layer1: Color[][],
    layer2: Color[][],
    riftLayer: number[][],
) => {
    const resultLayer: Color[][] = new Array(size);
    for (let i = 0; i < size; i++) {
        resultLayer[i] = new Array(size);
    }

    for (let x = 0; x < size; x += 1) {
        for (let y = 0; y < size; y += 1) {
            // Blend the two colored layers weighted by the combination layer.
            resultLayer[x][y] = riftLayer[x][y] == 1 ? layer1[x][y] : layer2[x][y];
        }
    }

    return resultLayer;
};
