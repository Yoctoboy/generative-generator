import { useMemo } from 'react';
import { WallBox, WallBoxProps } from './WallBox';

interface WallProps {
    totalLength: number;
    totalHeight: number;
    gridUnit: number;
}

export const Wall = ({ totalLength, totalHeight, gridUnit }: WallProps) => {
    // memoized so random boxes aren't regenerated on every render
    const boxes = useMemo(() => {
        const boxes: WallBoxProps[] = [];
        for (let u = 0; u + gridUnit <= totalLength; u += gridUnit) {
            for (let v = 0; v + gridUnit <= totalHeight; v += gridUnit) {
                const width = gridUnit + Math.random() * gridUnit * 1.5;
                const height = gridUnit + Math.random() * gridUnit * 1.5;
                const depth = gridUnit + Math.random() * gridUnit * 6;
                boxes.push({
                    x: u - (width - gridUnit) / 2,
                    y: v - (height - gridUnit) / 2,
                    z: 0,
                    height,
                    width,
                    depth,
                    color: 0xbbbbbb,
                });
            }
        }
        return boxes;
    }, [totalLength, totalHeight, gridUnit]);

    return (
        <>
            {boxes.map((b, i) => (
                <WallBox key={i} {...b} />
            ))}
        </>
    );
};
