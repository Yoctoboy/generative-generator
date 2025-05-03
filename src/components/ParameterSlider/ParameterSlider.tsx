import React from 'react';
import { SliderParameter } from '../Parameter';
import { WhiteText } from '../WhiteText';
import { StyledSlider } from './StyledSlider';

type ParameterSliderProps = SliderParameter & {
    value: number;
    setValue: (value: number) => void;
};

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
        if (Array.isArray(newValue)) {
            throw new Error('Cannot set the value of a Slider to an array');
        }
        setValue(newValue);
    };

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
    );
};
