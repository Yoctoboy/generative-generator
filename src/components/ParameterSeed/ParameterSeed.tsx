import React, { useMemo, useState } from 'react';
import { WhiteText } from '../WhiteText';
import { StyledTextField } from './StyledTextField';
import { debounce } from '@mui/material';

type ParameterSeedProps = {
    name: string;
    tooltip?: string;
    minValue: number;
    maxValue: number;
    initialValue: number;
    value: number;
    setValue: (value: number) => void;
};

export const ParameterSeed = ({
    name,
    minValue,
    maxValue,
    initialValue,
    setValue,
}: ParameterSeedProps): React.JSX.Element => {
    const [localValue, setLocalValue] = useState<number | null>(initialValue);

    const debouncedSetValue = useMemo(
        () => debounce((v: number) => setValue(v), 500),
        [],
    );

    const changeSeed = (newSeed: number) => {
        setLocalValue(newSeed);
        debouncedSetValue(newSeed);
    };

    const handleChangeSeedButtonClick = () => {
        const newSeed = Math.floor(
            Math.random() * (maxValue + 1 - minValue) + minValue,
        );
        setLocalValue(newSeed);
        setValue(newSeed);
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
                </div>
                <button type="button" onClick={handleChangeSeedButtonClick}>
                    Change
                </button>
            </div>
            <StyledTextField
                aria-label={`${name}-slider`}
                value={localValue ?? initialValue}
                onChange={(e) => changeSeed(parseInt(e.target.value))}
                name={name}
            />
        </div>
    );
};
