import { P5CanvasInstance } from '@p5-wrapper/react';
import {
    Parameter,
    ParameterType,
    ParameterValues,
    randomSeedParameter,
} from '../../components/Parameter';
import { fbmChain } from '../utils/mathFunctions';

const canvasWidth = 1000;
const canvasHeight = 750;

export const parameters = [
    randomSeedParameter,
    {
        name: 'FBM Octaves',
        minValue: 1,
        maxValue: 10,
        initialValue: 4,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'FBM Lacunarity',
        minValue: 1,
        maxValue: 4,
        initialValue: 2,
        step: 0.1,
        type: ParameterType.SLIDER,
        tooltip: 'Zoom on octaves',
    },
    {
        name: 'FBM Gain',
        minValue: 0.1,
        maxValue: 10,
        initialValue: 2,
        step: 0.1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'FBM Chaining',
        minValue: 0,
        maxValue: 10,
        initialValue: 2,
        step: 1,
        type: ParameterType.SLIDER,
    },
] as const satisfies Parameter[];

const normalizeAmplitude = (amp: number) => {
    // return amp;
    return Math.sin(Math.acos((amp - 0.5) * 2)) ** 10;
};
export const setup = (
    p5: P5CanvasInstance,
    paramValues: ParameterValues<typeof parameters>,
) => {
    return () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        // p5.pixelDensity(3) // check what that does
        p5.background(0);

        for (let ypos = 0; ypos < canvasHeight; ypos++) {
            for (let xpos = 0; xpos < canvasWidth; xpos++) {
                const x = (xpos / canvasWidth) * 1.5;
                const y = (ypos / canvasHeight) * 1.5;

                const amp = fbmChain({
                    p5,
                    x: x,
                    y: y,
                    octaves: paramValues['FBM Octaves'],
                    lacunarity: paramValues['FBM Lacunarity'],
                    gain: paramValues['FBM Gain'],
                    chains: paramValues['FBM Chaining'],
                });

                const alpha = normalizeAmplitude(amp) * 255;

                // const r =
                //     fbmChain({
                //         p5,
                //         x: x + 1000,
                //         y: y + 1000,
                //         octaves: paramValues['FBM Octaves'],
                //         lacunarity: paramValues['FBM Lacunarity'],
                //         gain: paramValues['FBM Gain'],
                //         chains: paramValues['FBM Chaining'],
                //     }) * 140;
                const r = p5.noise(x * 2 + 1000, y * 2) * 255;
                const b = p5.noise(x * 2, y * 2 + 1000) * 255;
                const rCondition = r > 120 && alpha > 90;
                const bCondition = b > 120 && alpha > 90;
                if (rCondition && bCondition) {
                    p5.set(
                        xpos,
                        ypos,
                        p5.color(
                            alpha - b + 120,
                            alpha - r - b + 240,
                            alpha,
                            255,
                        ),
                    );
                } else if (rCondition) {
                    p5.set(
                        xpos,
                        ypos,
                        p5.color(alpha, alpha - r + 120, alpha, 255),
                    );
                } else if (bCondition) {
                    p5.set(
                        xpos,
                        ypos,
                        p5.color(alpha - b + 120, alpha - b + 120, alpha, 255),
                    );
                } else p5.set(xpos, ypos, p5.color(alpha, alpha, alpha, 255));
            }

            p5.updatePixels();
        }
    };
};
