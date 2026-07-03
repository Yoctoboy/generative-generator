import { P5CanvasInstance } from '@p5-wrapper/react';
import { Color } from 'p5';

/**
 * Combines two intensity layers into a single `size` x `size` matrix of colors.
 * `layer1`/`layer2` (values in [0, 1]) modulate the brightness of `color1`/
 * `color2` respectively, and the two colored layers are then blended together
 * weighted by `combinationLayer` (`color1` when the weight is 1, `color2` when
 * it is 0).
 */
export const combineAndColorLayers = (
    p5: P5CanvasInstance,
    size: number,
    layer1: number[][],
    layer2: number[][],
    combinationLayer: number[][],
    color1: Color,
    color2: Color,
) => {
    const black = p5.color(0);

    const resultLayer: Color[][] = new Array(size);
    for (let i = 0; i < size; i++) {
        resultLayer[i] = new Array(size);
    }

    for (let x = 0; x < size; x += 1) {
        for (let y = 0; y < size; y += 1) {
            // Modulate each color's brightness by its layer's intensity.
            const c1 = p5.lerpColor(black, color1, layer1[x][y]);
            const c2 = p5.lerpColor(black, color2, layer2[x][y]);

            // Blend the two colored layers weighted by the combination layer.
            resultLayer[x][y] = p5.lerpColor(c2, c1, combinationLayer[x][y]);
        }
    }

    return resultLayer;
};
