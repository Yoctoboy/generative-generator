import { P5CanvasInstance, ReactP5Wrapper } from '@p5-wrapper/react'
import { ParameterValues } from '../Parameter'
import { SketchType } from '../Sketch'
import { seedRandomnessModules } from '../utils/seedRandomnessModules'
import { parameters, setup } from './setup'

const Sketch = ({
    paramValues,
}: {
    paramValues: ParameterValues<typeof parameters>
}) => {
    const sketch = (p5: P5CanvasInstance) => {
        seedRandomnessModules(p5, paramValues['Random Seed'])
        p5.setup = setup(p5, paramValues)
    }
    return <ReactP5Wrapper sketch={sketch} />
}

const DiamondSquareSketch: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: 'Diamond Square',
}
export default DiamondSquareSketch
