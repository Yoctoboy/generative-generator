import { Sketch } from '@p5-wrapper/react'

export type Parameter = {
    name: string
    minValue: number
    maxValue: number
    initialValue: number
    step: number
}

export type ExtendedSketch = {
    parameters: Parameter[]
    sketch: Sketch
}
