import React from 'react';
import { SliderParameter } from '../Parameter';
import { ParameterTooltip } from '../ParameterTooltip/ParameterTooltip';
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
    tooltip,
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                    }}
                >
                    <WhiteText>{name}</WhiteText>
                    {tooltip && <ParameterTooltip text={tooltip} />}
                </div>
            </div>
            <StyledSlider
                aria-label={`${name}-slider`}
                value={value ?? initialValue}
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
