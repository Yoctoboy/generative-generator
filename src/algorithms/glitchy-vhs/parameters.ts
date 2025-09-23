import {
    Parameter,
    ParameterType,
    randomSeedParameter,
} from '../../components/Parameter';

export const parameters = [
    randomSeedParameter,
    {
        name: 'Min glitch height',
        minValue: 1,
        maxValue: 2000,
        initialValue: 50,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Max glitch height',
        minValue: 1,
        maxValue: 2000,
        initialValue: 350,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Max offset size',
        minValue: 4,
        maxValue: 100,
        initialValue: 10,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Preserve color?',
        initialValue: false,
        type: ParameterType.CHECKBOX,
    },
] as const satisfies Parameter[];
