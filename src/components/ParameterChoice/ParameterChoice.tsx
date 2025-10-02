import React from 'react';
import { ChoiceParameter } from '../Parameter';
import { WhiteText } from '../WhiteText';
import { InputBase, MenuItem, Select, SelectChangeEvent } from '@mui/material';

type ParameterChoiceProps = ChoiceParameter & {
    value: string;
    setValue: (value: string) => void;
};

export const ParameterChoice = ({
    name,
    choices,
    value,
    setValue,
}: ParameterChoiceProps): React.JSX.Element => {
    const handleChange = (event: SelectChangeEvent<string>) => {
        setValue(event?.target.value);
    };

    return (
        <div>
            <WhiteText>{name}</WhiteText>
            <Select
                id={name}
                aria-label={`${name}-choice`}
                value={value}
                onChange={handleChange}
                input={<InputBase />}
                IconComponent={() => <></>}
                name={name}
            >
                {choices.map((choice) => (
                    <MenuItem key={choice} value={choice}>
                        <span style={{ textTransform: 'capitalize' }}>
                            {choice}
                        </span>
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
};
