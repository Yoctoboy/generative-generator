import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
    FormControl,
    InputBase,
    Select,
    SelectChangeEvent,
    styled,
} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import { SketchType } from '../algorithms/Sketch'
import { Sidebar } from './Sidebar'

const StyledFormControl = styled(FormControl)(() => ({
    '& .MuiInputBase-root': {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Montserrat',
        transition: 'background-color 0.3s',
        border: '1px solid grey',
        borderRadius: '4px',
        '&:focus': {
            outline: 'none',
            backgroundColor: 'white',
        },
        '&:hover': {
            color: 'black',
        },
    },
    '& .MuiSelect-icon': {
        color: 'white',
    },
}))

const StyledSelect = styled(InputBase)(() => ({
    '& .MuiInputBase-input': {
        color: 'white',
        border: 'none',
        background: 'transparent',
        transition: 'color 0.3s',
        padding: '10px 0 !important',
        '&:focus': {
            outline: 'none',
        },
        '&:hover': {
            color: 'black',
        },
    },
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        cursor: 'pointer',
    },
}))

export const SketchSelector = ({
    allSketches,
    currentSketch,
    setCurrentSketch,
}: {
    allSketches: SketchType[]
    currentSketch: SketchType
    setCurrentSketch: (value: SketchType) => void
}): React.JSX.Element => {
    const handleChange = (event: SelectChangeEvent<SketchType>) => {
        setCurrentSketch(event.target.value as SketchType)
    }
    return (
        <StyledFormControl>
            <Select
                id="project-selector"
                value={currentSketch}
                onChange={handleChange}
                input={<StyledSelect />}
                IconComponent={() => <></>}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            backgroundColor: 'rgba(0, 0, 0, 0.9)', // Dropdown menu background
                            color: 'white', // Dropdown menu text color
                        },
                    },
                    MenuListProps: {
                        sx: {
                            p: 0,
                        },
                    },
                }}
            >
                {allSketches.map((sketch) => (
                    // @ts-expect-error MUI does not let you use any object as value, but it works fine (only type checking is fucked)
                    <MenuItem key={sketch.sketchName} value={sketch}>
                        <Sidebar.SketchTitle>
                            {sketch.sketchName}
                        </Sidebar.SketchTitle>
                    </MenuItem>
                ))}
            </Select>
        </StyledFormControl>
    )
}
