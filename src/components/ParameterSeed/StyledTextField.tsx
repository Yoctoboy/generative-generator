import { TextField, styled } from '@mui/material';

export const StyledTextField = styled(TextField)(() => ({
    color: '#AAFFAA',
    width: '100%',
    marginTop: '8px',
    '& .MuiInputBase-root': {
        // padding: '2px',
        height: 30,
        border: '1px solid grey',
        transition: 'none',
    },
    '& .MuiInputBase-input': {
        height: '100%', // ensures the text aligns correctly
        boxSizing: 'border-box',
        padding: '0 2px', // adjust as needed
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: 'transparent', // remove blue outline
            boxShadow: 'none',
        },
    },
}));
