import React from 'react'
import { Parameter } from '../Parameter'
import { StyledSlider } from './StyledSlider'
import { WhiteText } from './WhiteText'

type ParameterSliderProps = Parameter & {
    value: number
    setValue: (value: number) => void
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
        <div>
            <WhiteText>{name}</WhiteText>
            <StyledSlider
                aria-label={`${name}-slider`}
                value={value ?? initialValue}
                defaultValue={initialValue}
                onChange={handleChange}
                min={minValue}
                max={maxValue}
                step={step}
                name={name}
                valueLabelDisplay="on"
            />
        </div>
    )
}
