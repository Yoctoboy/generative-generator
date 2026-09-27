import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

// RectAreaLight needs lookup tables to be loaded once before it can light anything
RectAreaLightUniformsLib.init();

type NeonPanelProps = {
    position: [number, number, number];
    width?: number;
    height?: number;
    color?: THREE.ColorRepresentation;
    // brightness (in nits)
    intensity?: number;
    // size of the black open-bottomed box around the light
    housingHeight?: number;
    housingThickness?: number;
    // how far the light sits above the housing's open bottom (recessed inside it)
    lightHeightToBottom?: number;
};

// A glowing rectangle: a visible panel for the looks, plus a RectAreaLight (the only
// three.js light that has a size) that actually lights the room.
// Horizontal, shining downwards only.
// No shadows with the normal renderer: those come with the path tracer.
export const NeonPanel = ({
    position,
    width = 300,
    height = 200,
    color = 'white',
    intensity = 10,
    housingHeight = 1000,
    housingThickness = 30,
    lightHeightToBottom = 10,
}: NeonPanelProps) => {
    // Black open-bottomed box around the light: a top slab and four side slabs
    // enclosing the panel's footprint (width along X, height along Z), from the
    // open bottom (y = 0) up to housingHeight. The light sits lightHeightToBottom above y = 0
    const t = housingThickness;
    const h = housingHeight;
    const housingSlabs: { size: [number, number, number]; position: [number, number, number] }[] = [
        // top
        { size: [width + 2 * t, t, height + 2 * t], position: [0, h + t / 2, 0] },
        // sides along Z (full length, they cover the corners)
        { size: [t, h, height + 2 * t], position: [(width + t) / 2, h / 2, 0] },
        { size: [t, h, height + 2 * t], position: [-(width + t) / 2, h / 2, 0] },
        // sides along X (fit between the two above)
        { size: [width, h, t], position: [0, h / 2, (height + t) / 2] },
        { size: [width, h, t], position: [0, h / 2, -(height + t) / 2] },
    ];

    return (
        <group position={position}>
            {housingSlabs.map((slab, i) => (
                <mesh key={i} position={slab.position}>
                    <boxGeometry args={slab.size} />
                    <meshStandardMaterial color="black" />
                </mesh>
            ))}

            {/* planes and RectAreaLights are vertical by default, with the light shining towards
                local -Z: tilting by -90° around X lays them flat, with the light pointing down */}
            <group position={[0, lightHeightToBottom, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                {/* meshBasicMaterial ignores lighting so it always looks lit; toneMapped={false}
                keeps it at full brightness. The path tracer renders the lights themselves */}
                <mesh userData={{ skipPathTracing: true }}>
                    <planeGeometry args={[width, height]} />
                    <meshBasicMaterial color={color} side={THREE.DoubleSide} toneMapped={false} />
                </mesh>

                <rectAreaLight width={width} height={height} color={color} intensity={intensity} />
            </group>
        </group>
    );
};
