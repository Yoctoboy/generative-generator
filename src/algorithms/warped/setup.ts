import { P5CanvasInstance } from '@p5-wrapper/react';
import { Parameter, randomSeedParameter } from '../../components/Parameter';
import { fbm } from '../utils/mathFunctions';

const canvasWidth = 900;
const canvasHeight = 600;

export const parameters = [randomSeedParameter] as const satisfies Parameter[];

export const setup = (p5: P5CanvasInstance) => {
    return () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        // p5.pixelDensity(3) // check what that does
        p5.background(0);

        const noiseFunc = (x: number, y: number) => {
            const res = p5.noise(0.02 * x, 0.02 * y);
            // if (res < 1) console.log(res);
            return res;
        };

        for (let x = 0; x < canvasWidth; x++) {
            for (let y = 0; y < canvasHeight; y++) {
                // const fbmVal = fbm(p5, x, y, 0.5);
                // p5.set(x, y, p5.color(fbmVal * 140));

                const x2 = noiseFunc(x, y);
                const y2 = noiseFunc(x + 5.2, y + 1.3);
                const x3 = noiseFunc(x + 4 * x2 + 1.7, y + 4 * y2 + 9.2);
                const y3 = noiseFunc(x + 4 * x2 + 8.3, y + 4 * y2 + 2.8);
                const noiseVal = noiseFunc(x + 4 * x3, y + 4 * y3);
                p5.set(x, y, p5.color(Math.floor(noiseVal * 255)));
            }
        }
        p5.updatePixels();
    };
};
