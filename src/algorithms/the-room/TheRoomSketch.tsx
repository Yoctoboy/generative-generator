import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { randInt } from 'three/src/math/MathUtils.js';
import { Parameter, ParameterType, ParameterValues, randomSeedParameter } from '../../components/Parameter';
import { SketchType } from '../Sketch';
import { CameraInfo } from './CameraInfo';
import { Wall } from './Wall';
import { WallBox } from './WallBox';

export const MINZ = 0,
    MINX = 0,
    MAXZ = 1200,
    MAXX = 1200,
    MAXY = 10;

const parameters = [
    randomSeedParameter,
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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);

    // CameraControls owns the camera orientation (camera.lookAt gets overridden),
    // so the initial view is set on the controls, once, when they are created
    const initCameraControls = useCallback(
        (controls: CameraControls | null) => {
            cameraControlRef.current = controls;
            controls?.setLookAt(roomSize * 0.2, 200, roomSize * 0.8, roomSize, 0, 0, false);
        },
        [roomSize],
    );

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div
                ref={cameraInfoRef}
                style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    zIndex: 1,
                    color: 'white',
                    whiteSpace: 'pre',
                }}
            />
            <Canvas camera={camera}>
                <color attach="background" args={['black']} />
                <CameraControls ref={initCameraControls} />
                <CameraInfo controlsRef={cameraControlRef} outputRef={cameraInfoRef} />

                {/* origin marker: red = X, green = Y, blue = Z, drawn on top of everything */}
                <axesHelper args={[200]} renderOrder={1} material-depthTest={false} />

                {/* walls */}
                <group key={0} position={[0, 0, 0]} rotation={[0, 0, 0]}>
                    <Wall totalHeight={1000} totalLength={1000} gridUnit={30} />
                </group>
                <group key={1} position={[roomSize, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                    <Wall totalHeight={1000} totalLength={1000} gridUnit={30} />
                </group>

                {/* floor */}
                <WallBox x={0} y={0} z={0} width={1000} depth={1000} height={1} color={0xbbbbbb} />
                <ambientLight intensity={Math.PI} />
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
