import { Slider, styled } from '@mui/material'

export const StyledSlider = styled(Slider)(() => ({
    color: '#AAFFAA',
    height: 5,
    padding: '15px 0',
    '& .MuiSlider-thumb': {
        backgroundColor: 'white',
        border: '2px solid currentColor',
    },
    '& .MuiSlider-valueLabel': {
        top: 45,
        fontSize: 13,
        backgroundColor: 'unset',
        color: 'white',
        '&::before': {
            display: 'none',
        },
        '& *': {
            background: 'transparent',
            color: '#fff',
        },
    },
    '& .MuiSlider-track': {
        border: 'none',
        height: 5,
    },
    '& .MuiSlider-rail': {
        opacity: 0.5,
        boxShadow: 'inset 0px 0px 4px -2px #000',
        backgroundColor: '#d0d0d0',
    },
}))
