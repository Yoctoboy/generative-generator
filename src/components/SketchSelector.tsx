import { Select, SelectChangeEvent } from '@mui/material'
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
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentSketch}
            label="Age"
            onChange={handleChange}
        >
            {allSketches.map((sketch) => (
                <MenuItem key={sketch.sketchName} value={sketch}>
                    {sketch.sketchName}
                </MenuItem>
            ))}
        </Select>
    )
}
