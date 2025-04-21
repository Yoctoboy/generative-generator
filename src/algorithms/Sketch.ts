import { Parameter, ParameterValues } from '../components/Parameter';

export type SketchType<T extends Parameter[] = Parameter[]> = {
    sketch: ({
        paramValues,
    }: {
        paramValues: ParameterValues<Parameter[]>;
    }) => React.JSX.Element;
    parameters: T;
    sketchName: string;
};
