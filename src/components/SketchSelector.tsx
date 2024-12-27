import {
    FormControl,
    InputBase,
    Select,
    SelectChangeEvent,
} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { SketchType } from '../algorithms/Sketch'

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
        <FormControl>
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
        </FormControl>
    )
}
