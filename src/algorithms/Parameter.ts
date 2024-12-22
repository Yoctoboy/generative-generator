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
