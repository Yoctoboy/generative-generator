import { QuestionMark } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

type ParameterTooltipProps = {
    text: string;
};

export const ParameterTooltip = ({ text }: ParameterTooltipProps) => {
    return (
        <Tooltip
            sx={{ '&:hover': { cursor: 'pointer' } }}
            title={text}
            placement="top"
            arrow
            slotProps={{
                tooltip: {
                    sx: {
                        textAlign: 'center', // This is the key line
                    },
                },
            }}
        >
            <QuestionMark
                sx={{
                    height: '16px',
                    width: '16px',
                    color: '#ccc',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                }}
            />
        </Tooltip>
    );
};
