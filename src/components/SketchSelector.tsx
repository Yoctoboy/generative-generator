import {
    FormControl,
    InputBase,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

export const SketchSelector = ({
    allSketchesNames,
    currentSketchName,
    setCurrentSketchName,
}: {
    allSketchesNames: string[];
    currentSketchName: string;
    setCurrentSketchName: (value: string) => void;
}): React.JSX.Element => {
    const handleChange = (event: SelectChangeEvent<string>) => {
        setCurrentSketchName(event.target.value);
    };

    return (
        <FormControl>
            <Select
                id="project-selector"
                value={currentSketchName}
                onChange={handleChange}
                input={<InputBase />}
                IconComponent={() => <></>}
            >
                {allSketchesNames.map((sketchName) => (
                    <MenuItem key={sketchName} value={sketchName}>
                        {sketchName}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
