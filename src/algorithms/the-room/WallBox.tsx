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
};

export const WallBox = ({
    x,
    y,
    z,
    width,
    height,
    depth,
    color,
}: WallBoxProps) => {
    const geometry = useMemo(
        () => new THREE.BoxGeometry(width, height, depth),
        [width, height, depth],
    );
    const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

    // boxGeometry is centered on its origin, so shift by half the size
    return (
        <group position={[x + width / 2, y + height / 2, z + depth / 2]}>
            <mesh geometry={geometry}>
                <meshStandardMaterial color={color} />
            </mesh>
            <lineSegments geometry={edges}>
                <lineBasicMaterial color={0x000000} />
            </lineSegments>
        </group>
    );
};
