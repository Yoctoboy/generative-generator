import { Button } from '@mui/material';

export const DownloadButton = () => {
    const downloadImage = () => {
        const canvas = document.querySelector('canvas.p5Canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'myCanvas.png';
            // @ts-expect-error toDataURL indeed exists
            link.href = canvas.toDataURL('image/png'); // Get the canvas data as a PNG
            link.click();
        } else {
            console.error('Canvas not found!');
        }
    };
    return (
        <Button variant={'outlined'} onClick={downloadImage}>
            Download
        </Button>
    );
};
