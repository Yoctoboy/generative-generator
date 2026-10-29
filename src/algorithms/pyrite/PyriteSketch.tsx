import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useCallback, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Parameter, ParameterValues, randomSeedParameter } from '../../components/Parameter';
import { SketchType } from '../Sketch';
import { CameraInfo } from '../utils/CameraInfo';
import { BounceLight } from './BounceLight';
import { Cube, cubeCenterToVertex } from './Cube';
import { Floor } from './Floor';

const parameters = [randomSeedParameter] as const satisfies Parameter[];

const sceneSize = 1000;

const cubeSize = 0.3 * sceneSize;
const cubeHoverHeight = 0.15 * sceneSize;
const cubeCenterY = cubeHoverHeight + cubeCenterToVertex(cubeSize);

const lightPosition = new THREE.Vector3(0.6 * sceneSize, 1 * sceneSize, 2 * sceneSize);
// physically based point lights fall off with the square of the distance, so the
// intensity is scaled by it to keep the cube lit the same whatever the light's position
const lightToCubeDistance = lightPosition.distanceTo(new THREE.Vector3(0, cubeCenterY, 0));
const lightIntensity = 4 * lightToCubeDistance ** 2;

// fog and background share the same color so the floor melts into the horizon
const skyColor = '#5a6270';
const floorColor = '#8a8478';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Sketch = ({ paramValues }: { paramValues: ParameterValues<typeof parameters> }) => {
    const cameraControlRef = useRef<CameraControls | null>(null);
    const cameraInfoRef = useRef<HTMLDivElement | null>(null);

    // created once: a new camera on each render would make react-three-fiber swap cameras
    const camera = useMemo(
        () => new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000),
        [],
    );

    // CameraControls owns the camera orientation (camera.lookAt gets overridden),
    // so the initial view is set on the controls, once, when they are created
    const initCameraControls = useCallback((controls: CameraControls | null) => {
        cameraControlRef.current = controls;
        controls?.setLookAt(sceneSize, sceneSize * 0.6, sceneSize, 0, cubeCenterY, 0, false);
    }, []);

    return (
        <div style={{ width: '100%', height: '100%' }}>
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
            <Canvas camera={camera} shadows>
                <color attach="background" args={[skyColor]} />
                <fog attach="fog" args={[skyColor, sceneSize * 2, sceneSize * 12]} />
                <CameraInfo controlsRef={cameraControlRef} outputRef={cameraInfoRef} />
                <CameraControls ref={initCameraControls} />

                {/* way bigger than the fog's far distance, so its edge is never visible */}
                <Floor size={sceneSize * 50} color={floorColor} />
                <Cube size={cubeSize} hoverHeight={cubeHoverHeight} color="#c9a74a" />

                <pointLight
                    position={lightPosition}
                    intensity={lightIntensity}
                    decay={2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-near={10}
                    shadow-camera-far={sceneSize * 10}
                    // avoids shadow acne (striped self-shadowing) on the cube's faces
                    shadow-bias={-0.0005}
                />
                {/* light source marker: unlit so it always looks bright, and must not cast
                    shadows since it wraps the light (it would shadow the whole scene) */}
                <mesh position={lightPosition}>
                    <sphereGeometry args={[sceneSize * 0.02, 16, 16]} />
                    <meshBasicMaterial color="white" />
                </mesh>
                {/* keeps the shadowed sides from being pitch black */}
                <ambientLight intensity={0.5} />
                {/* <BounceLight floorColor={floorColor} floorIntensity={0.6} skyColor={skyColor} skyIntensity={0.15} /> */}
            </Canvas>
        </div>
    );
};

const PyriteSketch: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: 'pyrite',
    type: 'THREE',
};
export default PyriteSketch;
