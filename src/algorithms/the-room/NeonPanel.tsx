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
    width = 230,
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

    // The white inner surfaces are separate planes laid on the slabs' inner faces (a plane
    // faces its local +Z, the rotations turn it towards the inside), rather than per-face
    // materials on the slabs: the path tracer mixes up materials on meshes with a material array.
    // EPS keeps them just off the slab faces so the two don't overlap
    const EPS = 0.1;
    const innerPlanes: { size: [number, number]; position: Vec3; rotation: Vec3 }[] = [
        // under the top, facing down
        { size: [width, height], position: [0, h - EPS, 0], rotation: [Math.PI / 2, 0, 0] },
        // on the +X side, facing -X / on the -X side, facing +X
        { size: [height, h], position: [width / 2 - EPS, h / 2, 0], rotation: [0, -Math.PI / 2, 0] },
        { size: [height, h], position: [-width / 2 + EPS, h / 2, 0], rotation: [0, Math.PI / 2, 0] },
        // on the +Z side, facing -Z / on the -Z side, facing +Z
        { size: [width, h], position: [0, h / 2, height / 2 - EPS], rotation: [0, Math.PI, 0] },
        { size: [width, h], position: [0, h / 2, -height / 2 + EPS], rotation: [0, 0, 0] },
    ];

    // shared by all slabs (black) and all inner planes (white)
    // specularIntensity: 0 removes the ~4% surface reflection every non-metal has, which
    // otherwise shows as a grey sheen in the path tracer: this is an "ideal" black
    const outerMaterial = useMemo(
        () => new THREE.MeshPhysicalMaterial({ color: 'black', specularIntensity: 0.01 }),
        [],
    );
    // the inner faces glow by themselves (emissive) in the light's color, since the light
    // shines down and barely reaches them. With the path tracer they also emit real light
    const innerMaterial = useMemo(
        () => new THREE.MeshStandardMaterial({ color: 'white', emissive: color, emissiveIntensity: innerGlow }),
        [color, innerGlow],
    );

    return (
        <group position={position}>
            {housingSlabs.map((slab, i) => (
                <mesh key={`slab-${i}`} position={slab.position} material={outerMaterial}>
                    <boxGeometry args={slab.size} />
                </mesh>
            ))}
            {innerPlanes.map((plane, i) => (
                <mesh key={`inner-${i}`} position={plane.position} rotation={plane.rotation} material={innerMaterial}>
                    <planeGeometry args={plane.size} />
                </mesh>
            ))}

            {/* planes and RectAreaLights are vertical by default, with the light shining towards
                local -Z: tilting by -90° around X lays them flat, with the light pointing down */}
            <group position={[0, lightHeightToBottom, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                {/* The visible panel: the path tracer never shows lights to the camera directly,
                    so this emissive (self-lit) surface is what you see, in both renderers.
                    Its brightness matches the light's, otherwise the path tracer shows it as a
                    dull grey next to the brightly lit floor.
                    It sits 0.5 behind the light (local +Z is up), so it doesn't block the light's
                    rays; toneMapped={false} keeps it at full brightness in the normal renderer */}
                <mesh position={[0, 0.5, 0]}>
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
