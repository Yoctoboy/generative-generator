import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useCallback, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { randInt } from 'three/src/math/MathUtils.js';
import { Parameter, ParameterType, ParameterValues, randomSeedParameter } from '../../components/Parameter';
import { SketchType } from '../Sketch';
import { CameraInfo } from './CameraInfo';
import { NeonPanel } from './NeonPanel';
import { Table } from './Table';
import { PathTracer } from './PathTracer';
import { Wall } from './Wall';
import { WallBox } from './WallBox';

export const MINZ = 0,
    MINX = 0,
    MAXZ = 1200,
    MAXX = 1200,
    MAXY = 10;

const parameters = [
    randomSeedParameter,
    {
        name: 'Path Tracing',
        initialValue: false,
        type: ParameterType.CHECKBOX,
    },
    // {
    //     name: 'Island Amount',
    //     minValue: 4,
    //     maxValue: 30,
    //     step: 1,
    //     initialValue: 10,
    //     type: ParameterType.SLIDER,
    // },
] as const satisfies Parameter[];

export const Sketch = ({ paramValues }: { paramValues: ParameterValues<typeof parameters> }) => {
    const cameraControlRef = useRef<CameraControls | null>(null);
    const cameraInfoRef = useRef<HTMLDivElement | null>(null);

    const roomSize = 1000;
    // created once: a new camera on each render would make react-three-fiber swap cameras,
    // which also makes the path tracer rebuild its whole copy of the scene
    const camera = useMemo(
        () => new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000),
        [],
    );

    // CameraControls owns the camera orientation (camera.lookAt gets overridden),
    // so the initial view is set on the controls, once, when they are created
    const initCameraControls = useCallback(
        (controls: CameraControls | null) => {
            cameraControlRef.current = controls;
            controls?.setLookAt(roomSize * 0.75, roomSize * 0.15, roomSize * 0.65, 0, 0, 0, false);
        },
        [roomSize],
    );

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* <div
                ref={cameraInfoRef}
                style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    zIndex: 1,
                    color: 'white',
                    whiteSpace: 'pre',
                }}
            /> */}
            <Canvas camera={camera}>
                <color attach="background" args={['black']} />
                <CameraControls ref={initCameraControls} />
                {/* <CameraInfo controlsRef={cameraControlRef} outputRef={cameraInfoRef} /> */}

                {/* origin marker: red = X, green = Y, blue = Z, drawn on top of everything */}
                {/* <axesHelper args={[200]} renderOrder={1} material-depthTest={false} /> */}

                {/* walls */}
                <group key={0} position={[0, 0, 0]} rotation={[0, 0, 0]}>
                    <Wall totalHeight={roomSize} totalLength={roomSize} gridUnit={20} />
                </group>
                <group key={1} position={[roomSize, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                    <Wall totalHeight={roomSize} totalLength={roomSize} gridUnit={20} />
                </group>
                <group key={2} position={[roomSize, 0, roomSize]} rotation={[0, Math.PI, 0]}>
                    <Wall totalHeight={roomSize} totalLength={roomSize} gridUnit={20} />
                </group>
                <group key={3} position={[0, 0, roomSize]} rotation={[0, Math.PI / 2, 0]}>
                    <Wall totalHeight={roomSize} totalLength={roomSize} gridUnit={20} />
                </group>

                {/* floor */}
                <WallBox x={0} y={0} z={0} width={roomSize} depth={roomSize} height={1} color={0xbbbbbb} />
                {/* horizontally centered in the room, shining down */}
                {/* the inner glow is a fake for the normal renderer: the path tracer lights the rim
                    for real, and small glowing surfaces are a big source of grain (white specks) */}
                <NeonPanel position={[0.4 * roomSize, roomSize * 0.23, 0.4 * roomSize]} />
                {/* right under the light, standing on the floor (whose top is at y = 1) */}
                <Table position={[0.4 * roomSize, 1, 0.4 * roomSize]} />

                {/* ignored by the path tracer, which only uses real light sources.
                    Kept low so the neon's light is visible */}
                <ambientLight intensity={0.2} />

                <PathTracer enabled={paramValues['Path Tracing'] as boolean} />
            </Canvas>
        </div>
    );
};

const TheRoomSketch: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: 'The Room',
    type: 'THREE',
};
export default TheRoomSketch;
