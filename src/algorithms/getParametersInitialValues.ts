import { Parameter, ParameterValues } from './Parameter'

export const getParametersInitialValues = <T extends Parameter[]>(
    parameters: T
): ParameterValues<T> => {
    return parameters.reduce((acc, cur) => {
        return {
            ...acc,
            [cur.name]: cur.initialValue,
        }
    }, {} as ParameterValues<T>)
}
