import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
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
    // glow around the overlays (not the path traced image, whose noise would bloom too)
    bloomStrength?: number;
    // 0 = tight glow hugging the overlays, 1 = wide soft halo
    bloomRadius?: number;
};

// Objects with userData.skipPathTracing are left out of the path traced image
// (the fat edge lines are Meshes under the hood and would be traced as garbage geometry).
// Objects with userData.pathTracerOverlay are left out too, and drawn normally (rasterized) on top
// of the path traced image instead, with a bloom glow, hidden where the rest of the scene is in front.
// Used for light surfaces: the path tracer never shows lights to the camera.
// Must be placed last inside the <Canvas>, so the scene is fully mounted when it's read
export const PathTracer = ({
    enabled = true,
    bounces = 4,
    renderScale = 1,
    tiles = 2,
    sceneKey,
    filterGlossyFactor = 0.5,
    // low values: the glow scales with the overlays' HDR brightness (the neon's emissive is 10×)
    bloomStrength = 0.15,
    bloomRadius = 1,
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

    // writes depth only, no color
    const depthOnlyMaterial = useMemo(() => new THREE.MeshBasicMaterial({ colorWrite: false }), []);
    // the overlays alone, on black, in HDR (half float) so their full brightness drives the bloom
    const overlayTarget = useMemo(() => new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }), []);
    // threshold 0: everything in overlayTarget blooms, since it only holds the overlays
    const bloomPass = useMemo(() => new UnrealBloomPass(new THREE.Vector2(1, 1), bloomStrength, bloomRadius, 0), []);
    // adds overlayTarget (overlays + their glow) on top of the canvas.
    // ONE + ONE: colors are added as is, whatever the alpha additive overlays left in the target
    const compositeQuad = useMemo(
        () =>
            new FullScreenQuad(
                new THREE.MeshBasicMaterial({
                    map: overlayTarget.texture,
                    blending: THREE.CustomBlending,
                    blendSrc: THREE.OneFactor,
                    blendDst: THREE.OneFactor,
                    transparent: true,
                    depthTest: false,
                    depthWrite: false,
                    toneMapped: false,
                }),
            ),
        [overlayTarget],
    );
    useEffect(
        () => () => {
            depthOnlyMaterial.dispose();
            overlayTarget.dispose();
            bloomPass.dispose();
            compositeQuad.material.dispose();
            compositeQuad.dispose();
        },
        [depthOnlyMaterial, overlayTarget, bloomPass, compositeQuad],
    );
    useEffect(() => {
        bloomPass.strength = bloomStrength;
        bloomPass.radius = bloomRadius;
    }, [bloomPass, bloomStrength, bloomRadius]);

    const drawingBufferSize = useMemo(() => new THREE.Vector2(), []);
    const clearColor = useMemo(() => new THREE.Color(), []);

    // Draws the overlays with their bloom on top of what's already on the canvas
    const drawOverlays = (overlays: THREE.Object3D[], skipped: THREE.Object3D[]) => {
        gl.getDrawingBufferSize(drawingBufferSize);
        if (overlayTarget.width !== drawingBufferSize.x || overlayTarget.height !== drawingBufferSize.y) {
            overlayTarget.setSize(drawingBufferSize.x, drawingBufferSize.y);
            bloomPass.setSize(drawingBufferSize.x, drawingBufferSize.y);
        }

        const autoClear = gl.autoClear;
        const background = scene.background;
        gl.getClearColor(clearColor);
        const clearAlpha = gl.getClearAlpha();
        gl.autoClear = false;
        scene.background = null;

        gl.setRenderTarget(overlayTarget);
        gl.setClearColor(0x000000, 0);
        gl.clear();

        // depth of the rest of the scene, so the overlays get hidden behind it
        overlays.forEach((object) => (object.visible = false));
        skipped.forEach((object) => (object.visible = false));
        scene.overrideMaterial = depthOnlyMaterial;
        gl.render(scene, camera);
        scene.overrideMaterial = null;
        overlays.forEach((object) => (object.visible = true));
        skipped.forEach((object) => (object.visible = true));

        overlays.forEach((object) => gl.render(object, camera));

        // adds the blurred glow into overlayTarget itself
        bloomPass.render(gl, overlayTarget, overlayTarget, 0, false);

        gl.setRenderTarget(null);
        compositeQuad.render(gl);

        gl.setClearColor(clearColor, clearAlpha);
        scene.background = background;
        gl.autoClear = autoClear;
    };

    // Priority 1 takes over rendering from react-three-fiber: each frame adds one
    // sample to the image, which gets less grainy over time. Moving the camera restarts it
    useFrame(() => {
        const overlays: THREE.Object3D[] = [];
        const skipped: THREE.Object3D[] = [];
        scene.traverse((object) => {
            if (!object.visible) return;
            if (object.userData.pathTracerOverlay) overlays.push(object);
            else if (object.userData.skipPathTracing) skipped.push(object);
        });

        if (enabled) {
            camera.updateMatrixWorld();
            if (!lastCameraMatrix.equals(camera.matrixWorld) || !lastProjectionMatrix.equals(camera.projectionMatrix)) {
                lastCameraMatrix.copy(camera.matrixWorld);
                lastProjectionMatrix.copy(camera.projectionMatrix);
                pathTracer.updateCamera();
            }
            pathTracer.renderSample();
        } else {
            // the path tracer has no copy of the scene: render it normally instead,
            // minus the overlays, drawn with their bloom below like when path tracing
            overlays.forEach((object) => (object.visible = false));
            gl.render(scene, camera);
            overlays.forEach((object) => (object.visible = true));
        }

        if (overlays.length > 0) drawOverlays(overlays, skipped);
    }, 1);

    return null;
};
