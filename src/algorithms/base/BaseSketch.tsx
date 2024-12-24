import { P5CanvasInstance, ReactP5Wrapper } from '@p5-wrapper/react'
import { Parameter, ParameterValues } from '../../components/Parameter'
import { SketchType } from '../Sketch'

const parameters = [
    {
        name: 'Speed',
        minValue: 0.001,
        maxValue: 0.1,
        initialValue: 0.01,
        step: 0.001,
    },
    {
        name: 'Background Hue',
        minValue: 0,
        maxValue: 360,
        initialValue: 274,
        step: 1,
    },
    {
        name: 'Background Saturation',
        minValue: 0,
        maxValue: 100,
        initialValue: 30,
        step: 1,
    },
] as const satisfies Parameter[]

const Sketch = ({
    paramValues,
}: {
    paramValues: ParameterValues<typeof parameters>
}) => {
    const sketch = (p5: P5CanvasInstance) => {
        p5.setup = () => {
            p5.colorMode('hsb')
            p5.createCanvas(600, 600, p5.WEBGL)
        }

        p5.draw = () => {
            p5.background(
                paramValues['Background Hue'],
                paramValues['Background Saturation'],
                100
            )
            p5.normalMaterial()
            p5.push()
            p5.rotateZ(p5.frameCount * paramValues.Speed)
            p5.rotateX(p5.frameCount * paramValues.Speed)
            p5.rotateY(p5.frameCount * paramValues.Speed)
            p5.plane(100)
            p5.pop()
        }
    }
    return <ReactP5Wrapper sketch={sketch} />
}

const BaseSketch: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: 'Base sketch test',
}
export default BaseSketch
