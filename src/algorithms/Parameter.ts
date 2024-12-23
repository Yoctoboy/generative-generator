export type Parameter = {
    name: string
    minValue: number
    maxValue: number
    initialValue: number
    step: number
}

export type ParameterValues<T extends Parameter[]> = Record<
    T[number]['name'],
    number
>

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
