export enum ParameterType {
    SLIDER = 'SLIDER',
    CHECKBOX = 'CHECKBOX',
    SEED = 'SEED',
    CHOICE = 'CHOICE',
}

type BaseParameter = {
    name: string;
    tooltip?: string;
};

export type SliderParameter = BaseParameter & {
    minValue: number;
    maxValue: number;
    initialValue: number;
    step: number;
    type: ParameterType.SLIDER;
};

export type CheckboxParameter = BaseParameter & {
    initialValue: boolean;
    type: ParameterType.CHECKBOX;
};

export type SeedParameter = BaseParameter & {
    minValue: number;
    maxValue: number;
    initialValue: number;
    type: ParameterType.SEED;
};

export type ChoiceParameter = BaseParameter & {
    initialValue: string;
    choices: string[];
    type: ParameterType.CHOICE;
};

export type Parameter =
    | SliderParameter
    | CheckboxParameter
    | SeedParameter
    | ChoiceParameter;

export type ParameterValues<T extends readonly Parameter[]> = {
    [K in T[number] as K['name']]: K extends CheckboxParameter
        ? boolean
        : K extends ChoiceParameter
          ? string
          : number;
};

export const getParametersInitialValues = <T extends readonly Parameter[]>(
    parameters: T,
): ParameterValues<T> => {
    return parameters.reduce((acc, cur) => {
        return {
            ...acc,
            [cur.name]: cur.initialValue,
        };
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    }, {} as ParameterValues<T>);
};

export const randomSeedParameter: SeedParameter = {
    name: 'Random Seed',
    minValue: 0,
    maxValue: 1e9,
    initialValue: Math.floor(Math.random() * 1e9),
    type: ParameterType.SEED,
};
