import { Parameter, ParameterValues } from './Parameter'

export type SketchType = {
    sketch: ({
        paramValues,
    }: {
        paramValues: ParameterValues<Parameter[]>
    }) => React.JSX.Element
    parameters: Parameter[]
    sketchName: string
}
