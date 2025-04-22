import React from 'react';
import { CheckboxParameter } from '../Parameter';
import { WhiteText } from '../WhiteText';
import { StyledCheckbox } from './StyledSlider';

type ParameterCheckboxProps = CheckboxParameter & {
    checked: boolean;
    setValue: (value: boolean) => void;
};

export const ParameterCheckbox = ({
    name,
    initialValue,
    checked,
    setValue,
}: ParameterCheckboxProps): React.JSX.Element => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event?.target.checked);
    };

    return (
        <div>
            <WhiteText>{name}</WhiteText>
            <StyledCheckbox
                aria-label={`${name}-slider`}
                defaultChecked={initialValue === true}
                checked={checked}
                onChange={handleChange}
                name={name}
            />
        </div>
    );
};
