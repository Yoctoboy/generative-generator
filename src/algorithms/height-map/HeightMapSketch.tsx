import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { P5CanvasInstance, ReactP5Wrapper } from '@p5-wrapper/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
    Parameter,
    ParameterType,
    ParameterValues,
    randomSeedParameter,
} from '../../components/Parameter';
import { generatePerlinNoiseLayer } from '../../methods/layerutils/perlinNoiseLayer';
import { seedRandomnessModules } from '../utils/seedRandomnessModules';
import { SketchType } from '../Sketch';

// Number of vertices per side of the terrain grid.
const GRID_SIZE = 513;
// World-space distance between two adjacent grid vertices.
const CELL_SIZE = 8;

const parameters = [
    randomSeedParameter,
    {
        name: 'Height Scale',
        minValue: 5,
        maxValue: 3000,
        initialValue: 1000,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Noise Density',
        minValue: 0.002,
        maxValue: 0.1,
        initialValue: 0.067,
        step: 0.001,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Light Azimuth',
        minValue: 0,
        maxValue: 360,
        initialValue: 45,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Light Elevation',
        minValue: 5,
        maxValue: 90,
        initialValue: 90,
        step: 1,
        type: ParameterType.SLIDER,
    },
] as const satisfies Parameter[];

const buildTerrainGeometry = (
    heightMap: number[][],
    heightScale: number,
) => {
    const size = heightMap.length;
    const offset = ((size - 1) * CELL_SIZE) / 2;

    const positions: number[] = [];
    for (let z = 0; z < size; z++) {
        for (let x = 0; x < size; x++) {
            positions.push(
                x * CELL_SIZE - offset,
                heightMap[z][x] * heightScale,
                z * CELL_SIZE - offset,
            );
        }
    }

    const indices: number[] = [];
    for (let z = 0; z < size - 1; z++) {
        for (let x = 0; x < size - 1; x++) {
            const a = z * size + x;
            const b = a + 1;
            const c = a + size;
            const d = c + 1;
            if ((x + z) % 2 === 0) {
                indices.push(a, c, b, b, c, d);
            } else {
                indices.push(a, c, d, a, d, b);
            }
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
};

const Terrain = ({
    heightMap,
    heightScale,
}: {
    heightMap: number[][];
    heightScale: number;
}) => {
    const geometry = useMemo(
        () => buildTerrainGeometry(heightMap, heightScale),
        [heightMap, heightScale],
    );

    const edges = useMemo(() => new THREE.WireframeGeometry(geometry), [geometry]);

    return (
        <mesh geometry={geometry} castShadow receiveShadow>
            <meshStandardMaterial color="white" flatShading />
            {/* <lineSegments geometry={edges}>
                <lineBasicMaterial color={0xee88ee} linewidth={1} />
            </lineSegments> */}
        </mesh>
    );
};

export const Sketch = ({
    paramValues,
}: {
    paramValues: ParameterValues<typeof parameters>;
}) => {
    const cameraControlRef = useRef<CameraControls | null>(null);
    const [heightMap, setHeightMap] = useState<number[][] | null>(null);

    const seed = paramValues['Random Seed'];
    const noiseDensity = paramValues['Noise Density'];
    useEffect(() => {
        setHeightMap(null);
    }, [seed, noiseDensity]);

    const noiseSketch = (p5: P5CanvasInstance) => {
        p5.setup = () => {
            p5.createCanvas(1, 1);
            p5.noLoop();
            seedRandomnessModules(p5, seed);
            setHeightMap(generatePerlinNoiseLayer(p5, GRID_SIZE, noiseDensity));
        };
    };

    const terrainSpan = GRID_SIZE * CELL_SIZE;
    const camera = useMemo(() => {
        const cam = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            100000,
        );
        cam.position.set(0, terrainSpan * 0.6, terrainSpan * 0.6);
        cam.lookAt(0, 0, 0);
        return cam;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const azimuthRad = (paramValues['Light Azimuth'] * Math.PI) / 180;
    const elevationRad = (paramValues['Light Elevation'] * Math.PI) / 180;
    const lightDistance = terrainSpan * 1.5;
    const lightPosition: [number, number, number] = [
        lightDistance * Math.cos(elevationRad) * Math.cos(azimuthRad),
        lightDistance * Math.sin(elevationRad),
        lightDistance * Math.cos(elevationRad) * Math.sin(azimuthRad),
    ];

    if (heightMap === null) {
        return (
            <div style={{ width: 1, height: 1, overflow: 'hidden', opacity: 0 }}>
                <ReactP5Wrapper sketch={noiseSketch} />
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas camera={camera} shadows>
                <CameraControls ref={cameraControlRef} />
                <ambientLight color={0x333333} intensity={Math.PI * 0.55} />
                <directionalLight
                    position={lightPosition}
                    color={0xee82ee}
                    intensity={Math.PI * 0.8}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-left={-terrainSpan}
                    shadow-camera-right={terrainSpan}
                    shadow-camera-top={terrainSpan}
                    shadow-camera-bottom={-terrainSpan}
                    shadow-camera-near={1}
                    shadow-camera-far={terrainSpan * 4}
                />
                <Terrain
                    heightMap={heightMap}
                    heightScale={paramValues['Height Scale']}
                />
            </Canvas>
        </div>
    );
};

const HeightMapSketch: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: 'Height Map',
    type: 'THREE',
};
export default HeightMapSketch;
