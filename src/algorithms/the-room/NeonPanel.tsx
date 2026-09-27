import { useMemo } from 'react';
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
    // how bright the housing's inner faces glow: 0 = not at all, 1 = as bright as the light color
    innerGlow?: number;
};

// A glowing rectangle: a visible panel for the looks, plus a RectAreaLight (the only
// three.js light that has a size) that actually lights the room.
// Horizontal, shining downwards only.
// No shadows with the normal renderer: those come with the path tracer.
export const NeonPanel = ({
    position,
    width = 200,
    height = 140,
    color = 'white',
    intensity = 10,
    housingHeight = 1000,
    housingThickness = 24,
    lightHeightToBottom = 10,
    innerGlow = 0.6,
}: NeonPanelProps) => {
    // Black open-bottomed box around the light: a top slab and four side slabs
    // enclosing the panel's footprint (width along X, height along Z), from the
    // open bottom (y = 0) up to housingHeight. The light sits lightHeightToBottom above y = 0
    const t = housingThickness;
    const h = housingHeight;
    // innerFace: index of the box face pointing inside the housing, in BoxGeometry's
    // face order: 0 = +X, 1 = -X, 2 = +Y, 3 = -Y, 4 = +Z, 5 = -Z
    const housingSlabs: { size: [number, number, number]; position: [number, number, number]; innerFace: number }[] = [
        // top
        { size: [width + 2 * t, t, height + 2 * t], position: [0, h + t / 2, 0], innerFace: 3 },
        // sides along Z (full length, they cover the corners)
        { size: [t, h, height + 2 * t], position: [(width + t) / 2, h / 2, 0], innerFace: 1 },
        { size: [t, h, height + 2 * t], position: [-(width + t) / 2, h / 2, 0], innerFace: 0 },
        // sides along X (fit between the two above)
        { size: [width, h, t], position: [0, h / 2, (height + t) / 2], innerFace: 5 },
        { size: [width, h, t], position: [0, h / 2, -(height + t) / 2], innerFace: 4 },
    ];

    // shared by all slabs: one material per face, black outside and white inside
    const outerMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 'black' }), []);
    // the inner faces glow by themselves (emissive) in the light's color, since the light
    // shines down and barely reaches them. With the path tracer they also emit real light
    const innerMaterial = useMemo(
        () => new THREE.MeshStandardMaterial({ color: 'white', emissive: color, emissiveIntensity: innerGlow }),
        [color, innerGlow],
    );

    return (
        <group position={position}>
            {housingSlabs.map((slab, i) => (
                <mesh
                    key={i}
                    position={slab.position}
                    material={[0, 1, 2, 3, 4, 5].map((face) =>
                        face === slab.innerFace ? innerMaterial : outerMaterial,
                    )}
                >
                    <boxGeometry args={slab.size} />
                </mesh>
            ))}

            {/* planes and RectAreaLights are vertical by default, with the light shining towards
                local -Z: tilting by -90° around X lays them flat, with the light pointing down */}
            <group position={[0, lightHeightToBottom, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                {/* The visible panel: the path tracer never shows lights to the camera directly,
                    so this emissive (self-lit) surface is what you see, in both renderers.
                    It sits 0.5 behind the light (local +Z is up), so it doesn't block the light's
                    rays; toneMapped={false} keeps it at full brightness */}
                <mesh position={[0, 0, 0.5]}>
                    <planeGeometry args={[width, height]} />
                    <meshStandardMaterial
                        color="black"
                        emissive={color}
                        emissiveIntensity={1}
                        side={THREE.DoubleSide}
                        toneMapped={false}
                    />
                </mesh>

                <rectAreaLight width={width} height={height} color={color} intensity={intensity} />
            </group>
        </group>
    );
};
