import { useMemo } from 'react';
import { createSeededRandom } from '../utils/seededRandom';
import { WallBox, WallBoxProps } from './WallBox';

interface WallProps {
    totalLength: number;
    totalHeight: number;
    gridUnit: number;
    seed: number;
}

export const Wall = ({ totalLength, totalHeight, gridUnit, seed }: WallProps) => {
    // memoized so random boxes aren't regenerated on every render
    const boxes = useMemo(() => {
        const random = createSeededRandom(seed);
        const boxes: WallBoxProps[] = [];
        for (let u = 0; u + gridUnit <= totalLength; u += gridUnit) {
            for (let v = 0; v + gridUnit <= totalHeight; v += gridUnit) {
                const width = gridUnit + random() * gridUnit * 1.5;
                const height = gridUnit + random() * gridUnit * 1.5;
                const depth = gridUnit + random() * gridUnit * 6;
                const isBoxColored =
                    random() < 0.15 &&
                    depth > 6.5 * gridUnit &&
                    v > 60 &&
                    height > gridUnit * 1.8 &&
                    width > gridUnit * 1.8;
                boxes.push({
                    x: u - (width - gridUnit) / 2,
                    y: v - (height - gridUnit) / 2,
                    z: 0,
                    height,
                    width,
                    depth,
                    color: isBoxColored ? 0x000 : 0xbbbbbb,
                });
            }
        }
        return boxes;
    }, [totalLength, totalHeight, gridUnit, seed]);

    return (
        <>
            {boxes.map((b, i) => (
                <WallBox key={i} {...b} />
            ))}
        </>
    );
};
