import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { randInt } from 'three/src/math/MathUtils.js';
import {
    Parameter,
    ParameterType,
    ParameterValues,
} from '../../components/Parameter';
import { SketchType } from '../Sketch';
import { Island, IslandProps } from './Island';
import { MAXX, MAXY, MAXZ, minDistanceBetweenIslands } from './constants';

const parameters: Parameter[] = [
    {
        name: 'Island Amount',
        minValue: 4,
        maxValue: 30,
        step: 1,
        initialValue: 10,
        type: ParameterType.SLIDER,
    },
];

export const Sketch = ({
    paramValues,
}: {
    paramValues: ParameterValues<typeof parameters>;
}) => {
    const cameraControlRef = useRef<CameraControls | null>(null);

    const distance = (a: IslandProps, b: IslandProps) => {
        return Math.sqrt(
            Math.pow(a.centerx - b.centerx, 2) +
                Math.pow(a.centerz - b.centerz, 2),
        );
    };

    let isOk = false;
    let islandsCoords;
    do {
        const islandsAmount = paramValues['Island Amount'];
        islandsCoords = [...Array(islandsAmount)].map(() => {
            return {
                centerx: randInt(0, MAXX),
                centerz: randInt(0, MAXZ),
                posy: randInt(0, MAXY),
                size: 10,
            };
        });
        isOk = true;
        for (let i = 0; i < islandsCoords.length && isOk; i++) {
            for (let j = i + 1; j < islandsCoords.length && isOk; j++) {
                if (
                    distance(islandsCoords[i], islandsCoords[j]) <
                    minDistanceBetweenIslands
                ) {
                    isOk = false;
                }
            }
        }
    } while (!isOk);

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        100000,
    );
    camera.position.set(MAXX + 300, 200, MAXZ + 300);
    camera.lookAt(MAXX / 2, -4000, MAXZ / 2);

    return (
        <Canvas camera={camera}>
            <CameraControls ref={cameraControlRef} />
            <ambientLight intensity={Math.PI} />
            {islandsCoords.map((coords, index) => (
                <Island key={index} {...coords} size={10} />
            ))}
        </Canvas>
    );
};

const SquareCloudsSketch: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: 'Square Clouds',
};
export default SquareCloudsSketch;
