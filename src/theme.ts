import { createTheme } from '@mui/material'

export const theme = createTheme({
    typography: {
        fontFamily: 'Montserrat',
    },
    components: {
        MuiSelect: {
            defaultProps: {
                MenuProps: {
                    PaperProps: {
                        sx: {
                            border: '1px solid var(--disabled-grey)',
                            borderRadius: '8px',
                            color: 'white',
                        },
                    },
                    MenuListProps: {
                        sx: {
                            p: 0,
                        },
                    },
                },
            },
        },
        MuiMenuItem: {
            defaultProps: {
                sx: {
                    fontSize: '1.2rem',
                },
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'black',
                    transition: 'color 0.3s ease, background-color 0.3s ease',
                    color: 'white',
                    '&:hover': {
                        color: 'black',
                        backgroundColor: 'white',
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'var(--selected-menuitem-background)',
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: 'white',
                        color: 'black',
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    color: 'white',
                    border: 'none',
                    textAlign: 'center',
                    background: 'transparent',
                    transition: 'color 0.3s',
                    padding: '10px 0 !important',
                    '&:focus': {
                        outline: 'none',
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: 'black',
                        cursor: 'pointer',
                    },
                },
            },
        },
        MuiButton: {
            defaultProps: {
                sx: {
                    border: '1px solid var(--disabled-grey)',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 0, 0)',
                    color: 'white',
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        color: 'white',
                        fontSize: 20,
                        transition: 'background-color 0.3s',
                        border: '1px solid var(--disabled-grey)',
                        borderRadius: '8px',
                        '&:focus': {
                            outline: 'none',
                            backgroundColor: 'white',
                        },
                    },
                    '& .MuiSelect-icon': {
                        color: 'white',
                    },
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    '& .MuiMenuItem-root.Mui-selected': {
                        backgroundColor: 'blue',
                    },
                },
            },
        },
    },
})
