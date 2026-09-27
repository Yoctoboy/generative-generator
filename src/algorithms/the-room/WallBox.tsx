import { useMemo } from 'react';
import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';

// Anchored at its min corner: the box spans
// [x, x + width] × [y, y + height] × [z, z + depth]
export type WallBoxProps = {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;
    color?: number;
    // outline thickness in world units (same units as the box sizes)
    edgeWidth?: number;
};

export const WallBox = ({ x, y, z, width, height, depth, color, edgeWidth = 1 }: WallBoxProps) => {
    const geometry = useMemo(() => new THREE.BoxGeometry(width, height, depth), [width, height, depth]);

    // Plain WebGL lines are always 1px wide whatever the distance, so edges are drawn
    // as "fat lines" whose width is in world units and shrinks with distance.
    // LineSegments2 needs a LineSegmentsGeometry, hence the conversion
    const edgeLines = useMemo(() => {
        const lineGeometry = new LineSegmentsGeometry().fromEdgesGeometry(new THREE.EdgesGeometry(geometry));
        const material = new LineMaterial({
            color: 0x000000,
            linewidth: edgeWidth,
            worldUnits: true,
            // smooths line edges using the canvas's MSAA samples, nearly free
            alphaToCoverage: true,
        });
        return new LineSegments2(lineGeometry, material);
    }, [geometry, edgeWidth]);

    // boxGeometry is centered on its origin, so shift by half the size
    return (
        <group position={[x + width / 2, y + height / 2, z + depth / 2]}>
            <mesh geometry={geometry}>
                {/* pushes faces slightly back so edge lines drawn on them don't flicker */}
                <meshStandardMaterial color={color} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
            </mesh>
            {edgeLines && <primitive object={edgeLines} />}
        </group>
    );
};
