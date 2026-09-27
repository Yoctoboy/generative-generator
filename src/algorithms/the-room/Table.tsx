import * as THREE from 'three';

type TableProps = {
    // center of the table's footprint; y is where its bottom sits (the floor)
    position: [number, number, number];
    // footprint, same convention as NeonPanel: width along X, height along Z
    width?: number;
    height?: number;
    // vertical size
    tableHeight?: number;
    color?: THREE.ColorRepresentation;
    // 0 = mirror-sharp reflections, 1 = matte
    roughness?: number;
    // 0 = plastic/lacquer-like (reflections stay white), 1 = metal (reflections tinted by color)
    metalness?: number;
};

// For now a plain glossy cuboid standing on the floor.
// Without the path tracer, the only things it can reflect are lights (as highlights):
// real reflections of the room come with path tracing
export const Table = ({
    position: [x, y, z],
    width = 200,
    height = 140,
    tableHeight = 80,
    color = '#000000',
    roughness = 0.05,
    metalness = 0.1,
}: TableProps) => {
    return (
        // boxGeometry is centered on its origin: lift it by half its height to stand on y
        <mesh position={[x, y + tableHeight / 2, z]}>
            <boxGeometry args={[width, tableHeight, height]} />
            {/* clearcoat adds a thin varnish-like reflective layer on top, for a lacquered look */}
            <meshPhysicalMaterial
                color={color}
                roughness={roughness}
                metalness={metalness}
                clearcoat={1}
                clearcoatRoughness={0.02}
            />
        </mesh>
    );
};
