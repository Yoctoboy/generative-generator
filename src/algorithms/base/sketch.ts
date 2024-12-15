import { ExtendedSketch } from '../ExtendedSketch'

export const baseSketch: ExtendedSketch = {
    sketch: (p5) => {
        p5.setup = () => p5.createCanvas(600, 400, p5.WEBGL)

        p5.draw = () => {
            p5.background(250)
            p5.normalMaterial()
            p5.push()
            p5.rotateZ(p5.frameCount * 0.01)
            p5.rotateX(p5.frameCount * 0.01)
            p5.rotateY(p5.frameCount * 0.01)
            p5.plane(100)
            p5.pop()
        }
    },
    parameters: [
        {
            name: 'Speed',
            minValue: 0.001,
            maxValue: 0.1,
            initialValue: 0.01,
            step: 0.001,
        },
    ],
}
