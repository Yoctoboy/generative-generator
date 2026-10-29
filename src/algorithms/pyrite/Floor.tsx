import * as THREE from 'three';

interface FloorProps {
    size: number;
    color: THREE.ColorRepresentation;
}

// A huge flat plane: its edge is far beyond the fog's far distance, so it fades
// into the background before it ends and reads as an infinite ground
export const Floor = ({ size, color }: FloorProps) => (
    // planes are created in the XY plane, facing +Z: lay it down so it faces up
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
    </mesh>
);
