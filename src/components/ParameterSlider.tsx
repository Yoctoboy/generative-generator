import { Slider } from '@mui/material'
import React from 'react'
import { Parameter } from '../algorithms/ExtendedSketch'

type ParameterSliderProps = Parameter & {
    value: number
    setValue: React.Dispatch<React.SetStateAction<number>>
}

export const ParameterSlider = ({
    name,
    step,
    minValue,
    maxValue,
    initialValue,
    value,
    setValue,
}: ParameterSliderProps): React.JSX.Element => {
    const handleChange = (_event: Event, newValue: number | number[]) => {
        setValue(newValue as number)
    }

    return (
        <Slider
            aria-label={`${name}-slider`}
            value={value}
            defaultValue={initialValue}
            onChange={handleChange}
            min={minValue}
            max={maxValue}
            step={step}
            name={name}
            valueLabelDisplay="on"
        />
    )
}
