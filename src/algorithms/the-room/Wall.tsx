import { useMemo } from 'react';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { unionEdges } from './unionEdges';
import { WallBox, WallBoxProps } from './WallBox';

interface WallProps {
    totalLength: number;
    totalHeight: number;
    gridUnit: number;
    // edge thickness in world units (same units as box sizes)
    edgeWidth?: number;
}

export const Wall = ({
    totalLength,
    totalHeight,
    gridUnit,
    edgeWidth = 1,
}: WallProps) => {
    // memoized so random boxes (and the costly CSG below) aren't recomputed on every render
    const boxes = useMemo(() => {
        const boxes: WallBoxProps[] = [];
        for (let u = 0; u + gridUnit <= totalLength; u += gridUnit) {
            for (let v = 0; v + gridUnit <= totalHeight; v += gridUnit) {
                const width = gridUnit + Math.random() * gridUnit * 1.5;
                const height = gridUnit + Math.random() * gridUnit * 1.5;
                const depth = gridUnit + Math.random() * gridUnit * 2;
                boxes.push({
                    x: u - (width - gridUnit) / 2,
                    y: v - (height - gridUnit) / 2,
                    z: 0,
                    height,
                    width,
                    depth,
                    color: 0xffffff,
                });
            }
        }
        return boxes;
    }, [totalLength, totalHeight, gridUnit]);

    // Plain WebGL lines are always 1px wide whatever the distance, so edges are
    // drawn as "fat lines" whose width is in world units and shrinks with distance
    const edgeLines = useMemo(() => {
        const geometry = new LineSegmentsGeometry().setPositions(
            unionEdges(boxes).getAttribute('position').array as Float32Array,
        );
        const material = new LineMaterial({
            color: 0x000000,
            linewidth: edgeWidth,
            worldUnits: true,
            // smooths line edges using the canvas's MSAA samples, nearly free
            alphaToCoverage: true,
        });
        return new LineSegments2(geometry, material);
    }, [boxes, edgeWidth]);

    return (
        <>
            {boxes.map((b, i) => (
                <WallBox key={i} {...b} edges={false} />
            ))}
            <primitive object={edgeLines} />
        </>
    );
};
