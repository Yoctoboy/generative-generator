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
};

// A glowing rectangle: a visible panel for the looks, plus a RectAreaLight (the only
// three.js light that has a size) that actually lights the room.
// Horizontal, shining downwards only.
export const NeonPanel = ({
    position,
    width = 250,
    height = 160,
    color = 'white',
    intensity = 10,
    housingHeight = 1000,
    housingThickness = 24,
    lightHeightToBottom = 1,
}: NeonPanelProps) => {
    // Black open-bottomed box around the light: a top slab and four side slabs
    // enclosing the panel's footprint (width along X, height along Z), from the
    // open bottom (y = 0) up to housingHeight. The light sits lightHeightToBottom above y = 0
    const t = housingThickness;
    const h = housingHeight;
    type Vec3 = [number, number, number];
    const housingSlabs: { size: Vec3; position: Vec3 }[] = [
        // top
        { size: [width + 2 * t, t, height + 2 * t], position: [0, h + t / 2, 0] },
        // sides along Z (full length, they cover the corners)
        { size: [t, h, height + 2 * t], position: [(width + t) / 2, h / 2, 0] },
        { size: [t, h, height + 2 * t], position: [-(width + t) / 2, h / 2, 0] },
        // sides along X (fit between the two above)
        { size: [width, h, t], position: [0, h / 2, (height + t) / 2] },
        { size: [width, h, t], position: [0, h / 2, -(height + t) / 2] },
    ];

    // shared by all slabs (black)
    // specularIntensity: 0 removes the ~4% surface reflection every non-metal has, which
    // otherwise shows as a grey sheen in the path tracer: this is an "ideal" black
    const outerMaterial = useMemo(
        () => new THREE.MeshPhysicalMaterial({ color: 'black', specularIntensity: 0.01 }),
        [],
    );

    return (
        <group position={position}>
            {housingSlabs.map((slab, i) => (
                <mesh key={`slab-${i}`} position={slab.position} material={outerMaterial}>
                    <boxGeometry args={slab.size} />
                </mesh>
            ))}

            {/* planes and RectAreaLights are vertical by default, with the light shining towards
                local -Z: tilting by -90° around X lays them flat, with the light pointing down */}
            <group position={[0, lightHeightToBottom, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                {/* The visible panel: the path tracer never shows lights to the camera directly,
                    so this emissive (self-lit) surface is what you see, in both renderers.
                    It's a pathTracerOverlay: left out of the path tracer and drawn on top of its
                    image. Otherwise bounced rays that reach the light also hit this panel right
                    behind it and add its glow on top of the light's (too bright, and very grainy
                    since the tracer only finds it by chance).
                    It sits 0.5 behind the light (local +Z is up), so it doesn't block the light's
                    rays; toneMapped={false} keeps it at full brightness */}
                <mesh position={[0, 0.5, 0]} userData={{ pathTracerOverlay: true }}>
                    <planeGeometry args={[width, height]} />
                    <meshStandardMaterial
                        color="black"
                        emissive={color}
                        emissiveIntensity={intensity}
                        side={THREE.DoubleSide}
                        toneMapped={false}
                    />
                </mesh>

                <rectAreaLight width={width} height={height} color={color} intensity={intensity} />
            </group>
        </group>
    );
};
