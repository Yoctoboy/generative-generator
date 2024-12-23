import {
    FormControl,
    InputBase,
    Select,
    SelectChangeEvent,
    styled,
} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { SketchType } from '../algorithms/Sketch'

const StyledFormControl = styled(FormControl)(() => ({
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
}))

const StyledSelect = styled(InputBase)(() => ({
    '& .MuiInputBase-input': {
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
            color: 'black',
        },
    },
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: 'black',
        cursor: 'pointer',
    },
}))

const StyledMenuItem = styled(MenuItem)(() => ({
    fontSize: '1.2rem',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
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
                            border: '1px solid var(--disabled-grey)',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(0, 0, 0)', // Dropdown menu background
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
                    <StyledMenuItem key={sketch.sketchName} value={sketch}>
                        {sketch.sketchName}
                    </StyledMenuItem>
                ))}
            </Select>
        </StyledFormControl>
    )
}
