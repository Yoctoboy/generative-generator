import { useMemo } from 'react';
import * as THREE from 'three';

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
    // draw this box's own outline; turn off when edges are drawn for a whole group of boxes
    edges?: boolean;
};

export const WallBox = ({
    x,
    y,
    z,
    width,
    height,
    depth,
    color,
    edges = true,
}: WallBoxProps) => {
    const geometry = useMemo(
        () => new THREE.BoxGeometry(width, height, depth),
        [width, height, depth],
    );
    const edgesGeometry = useMemo(
        () => (edges ? new THREE.EdgesGeometry(geometry) : null),
        [geometry, edges],
    );

    // boxGeometry is centered on its origin, so shift by half the size
    return (
        <group position={[x + width / 2, y + height / 2, z + depth / 2]}>
            <mesh geometry={geometry}>
                {/* pushes faces slightly back so edge lines drawn on them don't flicker */}
                <meshStandardMaterial
                    color={color}
                    polygonOffset
                    polygonOffsetFactor={1}
                    polygonOffsetUnits={1}
                />
            </mesh>
            {edgesGeometry && (
                <lineSegments geometry={edgesGeometry}>
                    <lineBasicMaterial color={0x000000} />
                </lineSegments>
            )}
        </group>
    );
};
