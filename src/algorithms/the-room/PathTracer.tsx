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
    // blurs glossy reflections seen after a bounce (0 = off, 1 = max): removes the bright specks
    // made by light going floor -> glossy table -> light, which almost never converge
    filterGlossyFactor?: number;
};

// Objects with userData.skipPathTracing are left out of the path traced image
// (the fat edge lines are Meshes under the hood and would be traced as garbage geometry).
// Objects with userData.pathTracerOverlay are left out too, and drawn normally (rasterized) on top
// of the path traced image instead, hidden where the rest of the scene is in front of them.
// Used for light surfaces: the path tracer never shows lights to the camera.
// Must be placed last inside the <Canvas>, so the scene is fully mounted when it's read
export const PathTracer = ({
    enabled = true,
    bounces = 4,
    renderScale = 1,
    tiles = 2,
    sceneKey,
    filterGlossyFactor = 0.5,
}: PathTracerProps) => {
    const gl = useThree((state) => state.gl);
    const scene = useThree((state) => state.scene);
    const camera = useThree((state) => state.camera);

    const pathTracer = useMemo(() => {
        const pathTracer = new WebGLPathTracer(gl);
        // The default random numbers ("stratified list") are the same for every pixel of a sample,
        // only shifted by a small tiled blue noise texture: neighbouring pixels pick nearly the same
        // points on the area light, which shows as banding in soft shadows that never goes away.
        // PCG gives each pixel its own independent random numbers: plain noise that averages out.
        // Not exposed by the library, hence reaching into its (untyped) internal renderer
        Reflect.get(pathTracer, '_pathTracer').material.setDefine('RANDOM_TYPE', 1);
        return pathTracer;
    }, [gl]);
    useEffect(() => () => pathTracer.dispose(), [pathTracer]);

    useEffect(() => {
        pathTracer.enablePathTracing = enabled;
        pathTracer.bounces = bounces;
        pathTracer.renderScale = renderScale;
        pathTracer.tiles.set(tiles, tiles);
        pathTracer.filterGlossyFactor = filterGlossyFactor;
        pathTracer.reset();
    }, [pathTracer, enabled, bounces, renderScale, tiles, filterGlossyFactor]);

    // The path tracer works on its own copy of the scene (merged geometry + BVH + materials),
    // so it doesn't see changes to the scene until this runs again. Hot reloads of a component
    // (e.g. changing a color in Table.tsx) don't trigger it: untick/tick the checkbox to rebuild.
    // Only built while enabled, so having path tracing off costs nothing
    useEffect(() => {
        if (!enabled) return;
        const hidden: THREE.Object3D[] = [];
        scene.traverse((object) => {
            if ((object.userData.skipPathTracing || object.userData.pathTracerOverlay) && object.visible) {
                object.visible = false;
                hidden.push(object);
            }
        });
        pathTracer.setScene(scene, camera);
        hidden.forEach((object) => (object.visible = true));
    }, [pathTracer, scene, camera, sceneKey, enabled]);

    const lastCameraMatrix = useMemo(() => new THREE.Matrix4(), []);
    const lastProjectionMatrix = useMemo(() => new THREE.Matrix4(), []);

    // Priority 1 takes over rendering from react-three-fiber: each frame adds one
    // sample to the image, which gets less grainy over time. Moving the camera restarts it
    useFrame(() => {
        // when off, the path tracer has no copy of the scene: render it normally instead
        if (!enabled) {
            gl.render(scene, camera);
            return;
        }
        camera.updateMatrixWorld();
        if (!lastCameraMatrix.equals(camera.matrixWorld) || !lastProjectionMatrix.equals(camera.projectionMatrix)) {
            lastCameraMatrix.copy(camera.matrixWorld);
            lastProjectionMatrix.copy(camera.projectionMatrix);
            pathTracer.updateCamera();
        }
        pathTracer.renderSample();
        drawOverlays();
    }, 1);

    // writes depth only, no color
    const depthOnlyMaterial = useMemo(() => new THREE.MeshBasicMaterial({ colorWrite: false }), []);
    useEffect(() => () => depthOnlyMaterial.dispose(), [depthOnlyMaterial]);

    const drawOverlays = () => {
        const overlays: THREE.Object3D[] = [];
        const skipped: THREE.Object3D[] = [];
        scene.traverse((object) => {
            if (!object.visible) return;
            if (object.userData.pathTracerOverlay) overlays.push(object);
            else if (object.userData.skipPathTracing) skipped.push(object);
        });
        if (overlays.length === 0) return;

        const autoClear = gl.autoClear;
        const background = scene.background;
        gl.autoClear = false;
        scene.background = null;
        gl.clearDepth();

        // depth of what the path tracer drew, so the overlays get hidden behind it
        overlays.forEach((object) => (object.visible = false));
        skipped.forEach((object) => (object.visible = false));
        scene.overrideMaterial = depthOnlyMaterial;
        gl.render(scene, camera);
        scene.overrideMaterial = null;
        overlays.forEach((object) => (object.visible = true));
        skipped.forEach((object) => (object.visible = true));

        overlays.forEach((object) => gl.render(object, camera));

        scene.background = background;
        gl.autoClear = autoClear;
    };

    return null;
};
