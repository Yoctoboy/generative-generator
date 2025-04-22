export enum ParameterType {
    SLIDER = 'SLIDER',
    CHECKBOX = 'CHECKBOX',
}

export type SliderParameter = {
    name: string;
    minValue: number;
    maxValue: number;
    initialValue: number;
    step: number;
    type: ParameterType.SLIDER;
};

export type CheckboxParameter = {
    name: string;
    initialValue: boolean;
    type: ParameterType.CHECKBOX;
};

export type Parameter = SliderParameter | CheckboxParameter;

export type ParameterValues<T extends Parameter[]> = {
    [K in T[number] as K['name']]: K extends SliderParameter ? number : boolean;
};

export const getParametersInitialValues = <T extends Parameter[]>(
    parameters: T,
): ParameterValues<T> => {
    return parameters.reduce((acc, cur) => {
        return {
            ...acc,
            [cur.name]: cur.initialValue,
        };
    }, {} as ParameterValues<T>);
};

export const randomSeedParameter: Parameter = {
    name: 'Random Seed',
    minValue: 0,
    maxValue: 1e9,
    initialValue: Math.floor(Math.random() * 1e9),
    step: 1,
    type: ParameterType.SLIDER,
};
