import { P5CanvasInstance } from '@p5-wrapper/react';

/**
 * Generates a `size` x `size` matrix filled with a bloom-ish 2-D gradient.
 * Returned values are real numbers between 0 and 1.
 */
export const generateBloomLayer = (p5: P5CanvasInstance, size: number) => {

    const centerX = p5.random(size/3, 2*size/3);
    const centerY = p5.random(size/3, 2*size/3);
    const moonSize = p5.random(size/15, size/10);
    const bloomSize = p5.random(size/6, size/1.5);
    const lightLayer = new Array(size);
    const bloomGradientRatio = 1.1; // ratio of 0-to-1 light gradient length from moon to moonSize
    for (let x = 0; x < size; x++) {
        lightLayer[x] = new Array(size);
        for (let y = 0; y < size; y++) {
            const distFromCenter = Math.hypot(x-centerX, y-centerY);
            if(distFromCenter < moonSize) lightLayer[x][y] = 0;
            else if(distFromCenter < moonSize * bloomGradientRatio) {
                // f(moonSize) = 0
                // f(moonSize * 1.05) = 1
                // f(x) = ax+b
                // a * moonSize + b = 0
                // a * (moonSize * 1.05) + b = 1
                // b = -a*moonSize
                // a = (1 - b)/(moonSize*1.05)
                // a*(moonSize*1.05) = 1 + a*moonSize
                // 0.05*a*moonSize = 1
                // a = 1/(moonSize*0.05)
                // b = -1/0.05
                lightLayer[x][y] =  ((1/(bloomGradientRatio - 1))/moonSize)*distFromCenter - (1/(bloomGradientRatio - 1));
            }
            else {
                const distFromMoon = distFromCenter - moonSize;
                lightLayer[x][y] = Math.pow(Math.max(-distFromMoon * (1/bloomSize) + 1, 0), 1.5);
            }

        }
    }

    return lightLayer;
};
