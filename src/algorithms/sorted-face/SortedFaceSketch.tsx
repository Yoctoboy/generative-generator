import { P5CanvasInstance, ReactP5Wrapper } from '@p5-wrapper/react'
import { Parameter, ParameterValues } from '../Parameter'
import { SketchType } from '../Sketch'
import { preload, setup } from './setup'

const parameters = [] as const satisfies Parameter[]

const Sketch = ({
    paramValues,
}: {
    paramValues: ParameterValues<typeof parameters>
}) => {
    const sketch = (p5: P5CanvasInstance) => {
        p5.preload = preload(p5)

        p5.setup = setup(p5)
    }
    return <ReactP5Wrapper sketch={sketch} />
}

const SortedFaceSketch: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: 'Sorted face',
}
export default SortedFaceSketch
