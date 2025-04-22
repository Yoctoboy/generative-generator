import { P5CanvasInstance, ReactP5Wrapper } from '@p5-wrapper/react';
import { ParameterValues } from '../../components/Parameter';
import { SketchType } from '../Sketch';
import { parameters, preload, setup } from './setup';

const Sketch = ({
    paramValues,
}: {
    paramValues: ParameterValues<typeof parameters>;
}) => {
    const sketch = (p5: P5CanvasInstance) => {
        p5.preload = preload(p5);

        p5.setup = setup(p5, paramValues);
    };
    return <ReactP5Wrapper sketch={sketch} />;
};

const GlitchyVHSSketch: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: 'GlitchyVHSSketch',
};
export default GlitchyVHSSketch;
