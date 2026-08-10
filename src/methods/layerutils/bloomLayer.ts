import { P5CanvasInstance } from '@p5-wrapper/react';

/**
 * Generates a `size` x `size` matrix filled with a bloom-ish 2-D gradient.
 * Returned values are real numbers between 0 and 1.
 */
export const generateBloomLayer = (p5: P5CanvasInstance, size: number) => {
    const centerX = p5.random(size / 8, size / 2);
    const centerY = p5.random(size/10, size / 2);
    const moonSize = p5.random(size / 15, size / 10);
    const bloomSize = p5.random(size / 4, size / 1.5);
    const lightLayer = new Array(size);
    const bloomGradientRatio = p5.random(1.08, 1.15); // ratio of 0-to-1 light gradient length from moon to moonSize
    for (let x = 0; x < size; x++) {
        lightLayer[x] = new Array(size);
        for (let y = 0; y < size; y++) {
            const distFromCenter = Math.hypot(x - centerX, y - centerY);
            if (distFromCenter < moonSize) lightLayer[x][y] = 0;
            else if (distFromCenter < moonSize * bloomGradientRatio) {
                // grosse fonction affine voilà
                lightLayer[x][y] =
                    (1 / (bloomGradientRatio - 1) / moonSize) * distFromCenter - 1 / (bloomGradientRatio - 1);
            } else {
                const distFromMoon = distFromCenter - moonSize * bloomGradientRatio;
                lightLayer[x][y] = Math.pow(Math.max(-distFromMoon * (1 / bloomSize) + 1, 0), 2);
            }
        }
    }

    return lightLayer;
};
