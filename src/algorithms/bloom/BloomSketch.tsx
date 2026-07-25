import { P5CanvasInstance, ReactP5Wrapper } from '@p5-wrapper/react';
import {
    Parameter,
    ParameterType,
    ParameterValues,
    randomSeedParameter,
} from '../../components/Parameter';
import { SketchType } from '../Sketch';
import { generateGreyscaleDiamondSquareLayer } from '../../methods/layerutils/diamondSquareLayer';
import { seedRandomnessModules } from '../utils/seedRandomnessModules';
import { generateSmoothHillsLayer } from '../../methods/layerutils/smoothHillsLayer';
import { combineAndColorLayers } from '../../methods/layerutils/combineAndColorLayers';
import { generateLightLayer } from '../../methods/layerutils/lightLayer';
import { multiplyLayers } from '../../methods/layerutils/multiplyLayers';
import { Color } from 'p5';
import { combineLayers } from '../../methods/layerutils/combineLayers';
import { generateRiftLayer } from '../../methods/layerutils/riftLayer';
import { combineRiftLayers } from '../../methods/layerutils/combineRiftLayers';
import { generatePerlinNoiseLayer } from '../../methods/layerutils/perlinNoiseLayer';
import { generateBloomLayer } from '../../methods/layerutils/bloomLayer';
import { applyFuncToLayer } from '../../methods/layerutils/applyFuncToLayer';

// GOOD SEEDS: 171667412; 795445253; 609824748
// WEIRD: 696472637

const parameters = [
    randomSeedParameter,
    {
        name: 'Diamond Square Division factor',
        minValue: 1.1,
        maxValue: 3,
        initialValue: 2.5,
        step: 0.1,
        type: ParameterType.SLIDER,
    },
    // {
    //     name: 'Background Hue',
    //     minValue: 0,
    //     maxValue: 360,
    //     initialValue: 274,
    //     step: 1,
    //     type: ParameterType.SLIDER,
    // },
    // {
    //     name: 'Background Saturation',
    //     minValue: 0,
    //     maxValue: 100,
    //     initialValue: 30,
    //     step: 1,
    //     type: ParameterType.SLIDER,
    // },
] as const satisfies Parameter[];

const Sketch = ({
    paramValues,
}: {
    paramValues: ParameterValues<typeof parameters>;
}) => {
    const sketch = (p5: P5CanvasInstance) => {
        const size = 1025; // must be 2^n + 1
        seedRandomnessModules(p5, paramValues['Random Seed']);

        p5.setup = () => {
            const renderLayer = (layer: number[][]) => {
                for (var i = 0; i < size; i++) {
                    for (var j = 0; j < size; j++) {
                        p5.set(i, j, layer[i][j] * 255);
                    }
                }
                p5.updatePixels();
            };

            p5.createCanvas(size, size);
            p5.background(0);

            // light layer first (because of seeding stuff)
            const bloomLayer = generateBloomLayer(p5, size);

            // Two diamond square layers
            const diamondSquarelayer = generateGreyscaleDiamondSquareLayer(
                p5,
                size,
                paramValues['Diamond Square Division factor'],
            );
            const rootedDiamondSquareLayer = applyFuncToLayer(
                p5,
                size,
                diamondSquarelayer,
                (x: number) => Math.pow(x, 0.3),
            );
            // const diamondSquareCombinationLayer = generateSmoothHillsLayer(
            //     p5,
            //     size,
            //     15,
            // );
            const lightedLayer1 = multiplyLayers(
                p5,
                size,
                rootedDiamondSquareLayer,
                bloomLayer,
            );
            // renderLayer(diamondSquareCombinationLayer);

            // p5.colorMode('hsb');
            // p5.colorMode('rgb');
            // const finalLayer1 = multiplyLayers(
            //     p5,
            //     size,
            //     noLightingLayer1,
            //     lightLayer,
            // );
            renderLayer(lightedLayer1);
        };
    };
    return <ReactP5Wrapper sketch={sketch} />;
};

const BloomSketch: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: 'Bloom',
};
export default BloomSketch;
