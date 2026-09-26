import { WallBox, WallBoxProps } from './WallBox';

interface WallProps {
    totalLength: number;
    totalHeight: number;
    gridUnit: number;
}

export const Wall = ({ totalLength, totalHeight, gridUnit }: WallProps) => {
    const boxes: WallBoxProps[] = [];
    for (let u = 0; u + gridUnit <= totalLength; u += gridUnit) {
        for (let v = 0; v + gridUnit <= totalHeight; v += gridUnit) {
            const height = gridUnit + Math.random() * gridUnit * 1.5;
            const width = gridUnit + Math.random() * gridUnit * 1.5;
            boxes.push({
                x: u,
                y: v,
                z: 0,
                height,
                width,
                depth: gridUnit + Math.random() * gridUnit * 2,
                color: 0xffffff,
            });
        }
    }

    return (
        <>
            {boxes.map((b, i) => (
                <WallBox key={i} {...b} />
            ))}
        </>
    );
};
