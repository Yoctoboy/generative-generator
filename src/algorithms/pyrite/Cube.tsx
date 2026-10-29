import { useMemo } from 'react';
import * as THREE from 'three';

interface CubeProps {
    size: number;
    // height of the lowest vertex above the ground
    hoverHeight: number;
    color: THREE.ColorRepresentation;
}

// half of the cube's main diagonal: distance from its center to any of its vertices
export const cubeCenterToVertex = (size: number) => (size * Math.sqrt(3)) / 2;

// A cube standing on one of its vertices: its main diagonal, from vertex (-1,-1,-1)
// to vertex (1,1,1), is rotated to be vertical
export const Cube = ({ size, hoverHeight, color }: CubeProps) => {
    const quaternion = useMemo(
        () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 1, 1).normalize(), new THREE.Vector3(0, 1, 0)),
        [],
    );

    return (
        <mesh
            position={[0, hoverHeight + cubeCenterToVertex(size), 0]}
            quaternion={quaternion}
            castShadow
            receiveShadow
        >
            <boxGeometry args={[size, size, size]} />
            <meshStandardMaterial color={color} roughness={0.35} metalness={0.6} />
        </mesh>
    );
};
