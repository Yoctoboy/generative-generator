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
                input={<InputBase />}
                IconComponent={() => <></>}
            >
                {allSketches.map((sketch) => (
                    // @ts-expect-error MUI does not let you use any object as value, but it works fine (only type checking is crappy)
                    <MenuItem key={sketch.sketchName} value={sketch}>
                        {sketch.sketchName}
                    </MenuItem>
                ))}
            </Select>
        </StyledFormControl>
    )
}
