import { P5CanvasInstance } from '@p5-wrapper/react';
import {
    Parameter,
    ParameterType,
    ParameterValues,
    randomSeedParameter,
} from '../../components/Parameter';
import { fbm } from '../utils/mathFunctions';

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
                const x = xpos / canvasWidth;
                const y = ypos / canvasHeight;

                let offset = 0;
                for (
                    let chain = 0;
                    chain < paramValues['FBM Chaining'];
                    chain++
                ) {
                    offset = fbm({
                        p5,
                        x: x + offset,
                        y: y + offset,
                        octaves: paramValues['FBM Octaves'],
                        lacunarity: paramValues['FBM Lacunarity'],
                        gain: paramValues['FBM Gain'],
                    });
                }
                const amp = fbm({
                    p5,
                    x: x + offset,
                    y: y + offset,
                    octaves: paramValues['FBM Octaves'],
                    lacunarity: paramValues['FBM Lacunarity'],
                    gain: paramValues['FBM Gain'],
                });

                const g = amp * 255;
                p5.set(xpos, ypos, p5.color(g, g, g, 255));
            }

            p5.updatePixels();
        }
    };
};
