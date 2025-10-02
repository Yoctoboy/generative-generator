import { P5CanvasInstance } from '@p5-wrapper/react';
import {
    Parameter,
    ParameterType,
    ParameterValues,
    randomSeedParameter,
} from '../../components/Parameter';
import { clip, fbm, fbmOffset } from '../utils/mathFunctions';
import { getGradientInitialPixelsColor } from './getGradientInitialPixelsColor';
import { getPointInitialPixelsColor } from './getPointInitialPixelsColor';

const canvasWidth = 1000;
const canvasHeight = 750;

enum InitialColorType {
    POINT = 'point',
    GRADIENT = 'gradient',
}

export const parameters = [
    randomSeedParameter,
    {
        name: 'FBM Zoom',
        minValue: 0.1,
        maxValue: 10,
        initialValue: 0.7,
        step: 0.1,
        type: ParameterType.SLIDER,
    },
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
    {
        name: 'Chaos Factor',
        minValue: 1,
        maxValue: 100,
        initialValue: 2,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Initial color type',
        choices: [InitialColorType.GRADIENT, InitialColorType.POINT],
        initialValue: InitialColorType.GRADIENT,
        type: ParameterType.CHOICE,
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

        // Define an initial picture of some colors with gradient
        const initialPixelColor =
            paramValues['Initial color type'] === InitialColorType.GRADIENT
                ? getGradientInitialPixelsColor(
                      p5,
                      canvasHeight,
                      canvasWidth,
                      paramValues['Chaos Factor'],
                  )
                : getPointInitialPixelsColor(p5, canvasHeight, canvasWidth);

        for (let ypos = 0; ypos < canvasHeight; ypos++) {
            for (let xpos = 0; xpos < canvasWidth; xpos++) {
                const x = xpos / canvasWidth / paramValues['FBM Zoom'];
                const y = ypos / canvasHeight / paramValues['FBM Zoom'];

                // const amp = fbmChain({
                //     p5,
                //     x: x,
                //     y: y,
                //     octaves: paramValues['FBM Octaves'],
                //     lacunarity: paramValues['FBM Lacunarity'],
                //     gain: paramValues['FBM Gain'],
                //     chains: paramValues['FBM Chaining'],
                // });
                let offset = 0;
                for (
                    let chain = 0;
                    chain < paramValues['FBM Chaining'];
                    chain++
                ) {
                    offset = fbmOffset({
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
                const alpha = normalizeAmplitude(amp);
                const initialX = clip(
                    Math.floor(
                        (x + offset) * canvasWidth * paramValues['FBM Zoom'],
                    ),
                    0,
                    canvasWidth - 1,
                );
                const initialY = clip(
                    Math.floor(
                        (y + offset) * canvasHeight * paramValues['FBM Zoom'],
                    ),
                    0,
                    canvasHeight - 1,
                );
                const color = initialPixelColor[initialX][initialY];
                p5.set(
                    xpos,
                    ypos,
                    p5.color(
                        p5.red(color),
                        p5.green(color),
                        p5.blue(color),
                        alpha * 255,
                    ),
                );
            }

            p5.updatePixels();
        }
    };
};
