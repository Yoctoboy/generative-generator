import { Environment, Lightformer } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface BounceLightProps {
    floorColor: THREE.ColorRepresentation;
    // brightness of the floor as seen by reflections, roughly how lit it is by the point light
    floorIntensity: number;
    skyColor: THREE.ColorRepresentation;
    skyIntensity: number;
}

// The rasterizer doesn't bounce light, so this fakes it with an environment map: a tiny
// scene rendered once into a cube map, that every standard material samples for its
// indirect lighting. Faces looking down see the floor, faces looking up see the sky.
// Unlike an ambient/hemisphere light it also shows up in metallic reflections.
export const BounceLight = ({ floorColor, floorIntensity, skyColor, skyIntensity }: BounceLightProps) => {
    const dimmedSkyColor = useMemo(() => new THREE.Color(skyColor).multiplyScalar(skyIntensity), [skyColor, skyIntensity]);

    return (
        <Environment resolution={256} frames={1}>
            {/* sky dome, seen from the inside */}
            <mesh scale={50}>
                <sphereGeometry args={[1, 32, 16]} />
                <meshBasicMaterial color={dimmedSkyColor} side={THREE.BackSide} toneMapped={false} />
            </mesh>
            {/* floor: slightly below the cube map's center and much wider than the dome,
                so it covers the whole lower hemisphere. Lightformers face +Z: turned to face up */}
            <Lightformer
                form="rect"
                color={floorColor}
                intensity={floorIntensity}
                position={[0, -1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={200}
            />
        </Environment>
    );
};
