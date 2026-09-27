import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { WebGLPathTracer } from 'three-gpu-pathtracer';

type PathTracerProps = {
    // when off, the scene is rendered normally (rasterized)
    enabled?: boolean;
    // how many times a light ray can bounce: more = brighter, more realistic indirect light, slower
    bounces?: number;
    // fraction of the canvas resolution that is traced: 0.5 = 4× fewer rays per sample
    renderScale?: number;
    // each sample is split into tiles × tiles chunks, one chunk per frame, so the page stays responsive
    tiles?: number;
    // change this value to rebuild the path tracer's copy of the scene (e.g. after regenerating walls)
    sceneKey?: unknown;
};

// Objects with userData.skipPathTracing are left out of the path traced image
// (the fat edge lines are Meshes under the hood and would be traced as garbage geometry).
// Must be placed last inside the <Canvas>, so the scene is fully mounted when it's read
export const PathTracer = ({ enabled = true, bounces = 3, renderScale = 0.5, tiles = 3, sceneKey }: PathTracerProps) => {
    const gl = useThree((state) => state.gl);
    const scene = useThree((state) => state.scene);
    const camera = useThree((state) => state.camera);

    const pathTracer = useMemo(() => new WebGLPathTracer(gl), [gl]);
    useEffect(() => () => pathTracer.dispose(), [pathTracer]);

    useEffect(() => {
        pathTracer.enablePathTracing = enabled;
        pathTracer.bounces = bounces;
        pathTracer.renderScale = renderScale;
        pathTracer.tiles.set(tiles, tiles);
        pathTracer.reset();
    }, [pathTracer, enabled, bounces, renderScale, tiles]);

    // The path tracer works on its own copy of the scene (merged geometry + BVH),
    // so it doesn't see changes to the scene until this runs again
    useEffect(() => {
        const hidden: THREE.Object3D[] = [];
        scene.traverse((object) => {
            if (object.userData.skipPathTracing && object.visible) {
                object.visible = false;
                hidden.push(object);
            }
        });
        pathTracer.setScene(scene, camera);
        hidden.forEach((object) => (object.visible = true));
    }, [pathTracer, scene, camera, sceneKey]);

    const lastCameraMatrix = useMemo(() => new THREE.Matrix4(), []);
    const lastProjectionMatrix = useMemo(() => new THREE.Matrix4(), []);

    // Priority 1 takes over rendering from react-three-fiber: each frame adds one
    // sample to the image, which gets less grainy over time. Moving the camera restarts it
    useFrame(() => {
        camera.updateMatrixWorld();
        if (!lastCameraMatrix.equals(camera.matrixWorld) || !lastProjectionMatrix.equals(camera.projectionMatrix)) {
            lastCameraMatrix.copy(camera.matrixWorld);
            lastProjectionMatrix.copy(camera.projectionMatrix);
            pathTracer.updateCamera();
        }
        pathTracer.renderSample();
    }, 1);

    return null;
};
