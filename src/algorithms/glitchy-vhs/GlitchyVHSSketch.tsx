import { P5CanvasInstance, ReactP5Wrapper } from '@p5-wrapper/react';
import { Parameter, ParameterValues } from '../../components/Parameter';
import { SketchType } from '../Sketch';
import { preload, setup } from './setup';

const parameters = [
    {
        name: 'Speed',
        minValue: 0.001,
        maxValue: 0.1,
        initialValue: 0.01,
        step: 0.001,
    },
] as const satisfies Parameter[];

const Sketch = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    paramValues,
}: {
    paramValues: ParameterValues<typeof parameters>;
}) => {
    const sketch = (p5: P5CanvasInstance) => {
        p5.preload = preload(p5);

        p5.setup = setup(p5);
    };
    return <ReactP5Wrapper sketch={sketch} />;
};

const GlitchyVHSSketch: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: 'GlitchyVHSSketch',
};
export default GlitchyVHSSketch;
