import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { randInt } from 'three/src/math/MathUtils.js';
import { Parameter, ParameterType, ParameterValues, randomSeedParameter } from '../../components/Parameter';
import { SketchType } from '../Sketch';
import { Wall } from './Wall';

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

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.set(MAXX + 300, 200, MAXZ + 300);
    camera.lookAt(0, 0, 0);

    return (
        <Canvas camera={camera}>
            <color attach="background" args={['black']} />
            <CameraControls ref={cameraControlRef} />
            <Wall totalHeight={1000} totalLength={1000} gridUnit={30} />
            <ambientLight intensity={Math.PI} />
        </Canvas>
    );
};

const TheRoomSketch: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: 'The Room',
    type: 'THREE',
};
export default TheRoomSketch;
