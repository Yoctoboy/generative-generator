import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { createSeededRandom } from '../utils/seededRandom';

type NeonDustProps = {
    // footprint of the light panel the dust sits under (X, Z)
    panelWidth: number;
    panelHeight: number;
    // same seed = same motes (positions, sizes, shades)
    seed: number;
    color?: THREE.ColorRepresentation;
    count?: number;
    // how far below the panel motes can be (they stay within its footprint): the dust is densest
    // against the panel, and thins out linearly down to none at this depth
    maxDist?: number;
    // mote diameter, in world units (motes smaller than a pixel are drawn dimmer instead of smaller)
    moteSize?: number;
    brightness?: number;
    // distance over which the light reaching a mote fades out
    falloff?: number;
};

const vertexShader = /* glsl */ `
    uniform float uMoteSize;
    uniform float uViewportHeight;
    uniform float uBrightness;
    uniform float uFalloff;
    uniform vec2 uHalfPanel;
    uniform vec3 uColor;

    // random values in [0, 1) per mote
    attribute vec3 aSeed;

    varying vec3 vColor;

    // Henyey-Greenstein: dust scatters light mostly forward, so motes seen against the light
    // glint more. Normalized to 1 when looking at the mote from the side
    float phase(float cosAngle) {
        const float g = 0.4;
        float hg = (1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * cosAngle, 1.5);
        float side = (1.0 - g * g) / pow(1.0 + g * g, 1.5);
        return hg / side;
    }

    void main() {
        // light from the panel, approximated through its closest point: fades with distance,
        // and with how slanted the mote is from it (the panel shines like a flat diffuse surface)
        vec2 closest = clamp(position.xz, -uHalfPanel, uHalfPanel);
        vec3 fromLight = position - vec3(closest.x, 0.0, closest.y);
        float dist = max(length(fromLight), 1e-3);
        float cosTheta = -position.y / dist;
        float light = cosTheta / (1.0 + dist * dist / (uFalloff * uFalloff));

        vec4 world = modelMatrix * vec4(position, 1.0);
        vec3 lightDir = normalize(mat3(modelMatrix) * fromLight);
        vec3 viewDir = normalize(cameraPosition - world.xyz);
        float scattering = phase(dot(lightDir, viewDir));

        // flakes face every which way: a few of them catch the light much more than the others
        float sparkle = 0.35 + 2.5 * pow(aSeed.x, 8.0);
        // each mote's own shade of grey, from dark soot to pale fluff
        float shade = 0.15 + 0.85 * aSeed.z;

        vec4 view = viewMatrix * world;
        gl_Position = projectionMatrix * view;
        float sizePx = uMoteSize * (0.5 + aSeed.y) * projectionMatrix[1][1] * 0.5 * uViewportHeight / -view.z;
        float drawnPx = max(sizePx, 1.0);
        gl_PointSize = drawnPx;
        // a mote drawn bigger than it is gets dimmed, so it gives off the same amount of light
        float coverage = (sizePx * sizePx) / (drawnPx * drawnPx);

        vColor = uColor * uBrightness * light * scattering * sparkle * shade * coverage;
    }
`;

const fragmentShader = /* glsl */ `
    varying vec3 vColor;

    void main() {
        // soft round dot
        float r = length(gl_PointCoord - 0.5) * 2.0;
        float strength = 1.0 - smoothstep(0.0, 1.0, r);
        gl_FragColor = vec4(vColor * strength, 1.0);
    }
`;

// Dust motes hanging in the light under a NeonPanel, lit by it, denser close to it.
// Its origin is the light's plane, the dust goes down from there (-Y).
// A pathTracerOverlay: drawn over the path traced image rather than path traced, as tiny
// path traced motes would look like grain until the image has fully converged
export const NeonDust = ({
    panelWidth,
    panelHeight,
    seed,
    color = 'white',
    count = 200,
    maxDist = 80,
    moteSize = 0.8,
    brightness = 3,
    falloff = 150,
}: NeonDustProps) => {
    const gl = useThree((state) => state.gl);

    const geometry = useMemo(() => {
        const random = createSeededRandom(seed);
        const positions = new Float32Array(count * 3);
        const seeds = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // anywhere within the panel's footprint
            const x = (random() - 0.5) * panelWidth;
            const z = (random() - 0.5) * panelHeight;
            // depth below the panel with a density of 1 - depth / maxDist: maxDist × (1 - √u) is
            // the inverse of that density's cumulative distribution, applied to a uniform u
            const y = -maxDist * (1 - Math.sqrt(random()));

            positions.set([x, y, z], i * 3);
            seeds.set([random(), random(), random()], i * 3);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
        return geometry;
    }, [seed, count, panelWidth, panelHeight, maxDist]);
    useEffect(() => () => geometry.dispose(), [geometry]);

    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    uMoteSize: { value: 0 },
                    uViewportHeight: { value: 1 },
                    uBrightness: { value: 0 },
                    uFalloff: { value: 1 },
                    uHalfPanel: { value: new THREE.Vector2() },
                    uColor: { value: new THREE.Color() },
                },
                // light adds up: ONE + ONE
                blending: THREE.CustomBlending,
                blendSrc: THREE.OneFactor,
                blendDst: THREE.OneFactor,
                transparent: true,
                depthWrite: false,
                toneMapped: false,
            }),
        [],
    );
    useEffect(() => () => material.dispose(), [material]);

    useEffect(() => {
        const { uniforms } = material;
        uniforms.uMoteSize.value = moteSize;
        uniforms.uBrightness.value = brightness;
        uniforms.uFalloff.value = falloff;
        uniforms.uHalfPanel.value.set(panelWidth / 2, panelHeight / 2);
        uniforms.uColor.value.set(color);
    }, [material, moteSize, brightness, falloff, panelWidth, panelHeight, color]);

    // mote sizes are in pixels of the canvas, which can be resized
    const drawingBufferSize = useMemo(() => new THREE.Vector2(), []);
    useFrame(() => {
        material.uniforms.uViewportHeight.value = gl.getDrawingBufferSize(drawingBufferSize).y;
    });

    return <points geometry={geometry} material={material} userData={{ pathTracerOverlay: true }} />;
};
