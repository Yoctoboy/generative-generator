import { P5CanvasInstance, ReactP5Wrapper } from '@p5-wrapper/react';
import { ParameterValues } from '../../components/Parameter';
import { SketchType } from '../Sketch';
import { parameters, setup } from './setup';
import { seedRandomnessModules } from '../utils/seedRandomnessModules';

const Sketch = ({
    paramValues,
}: {
    paramValues: ParameterValues<typeof parameters>;
}) => {
    const sketch = (p5: P5CanvasInstance) => {
        seedRandomnessModules(p5, paramValues['Random Seed']);

        p5.setup = setup(p5);
    };
    return <ReactP5Wrapper sketch={sketch} />;
};

const WarpedSketch: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: 'Warped',
};
export default WarpedSketch;
