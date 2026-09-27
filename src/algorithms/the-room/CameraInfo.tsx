import { CameraControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RefObject, useMemo } from 'react';
import * as THREE from 'three';

const format = (v: THREE.Vector3) => `${v.x.toFixed(0)}, ${v.y.toFixed(0)}, ${v.z.toFixed(0)}`;

// Lives inside the <Canvas> to read the camera every frame, and writes straight
// into an HTML element outside of it (no React state, so no re-render of the sketch)
export const CameraInfo = ({
    controlsRef,
    outputRef,
}: {
    controlsRef: RefObject<CameraControls | null>;
    outputRef: RefObject<HTMLDivElement | null>;
}) => {
    const position = useMemo(() => new THREE.Vector3(), []);
    const target = useMemo(() => new THREE.Vector3(), []);

    useFrame(() => {
        const controls = controlsRef.current;
        const output = outputRef.current;
        if (!controls || !output) return;
        controls.getPosition(position);
        controls.getTarget(target);
        const text = `camera  ${format(position)}\ntarget  ${format(target)}`;
        if (output.textContent !== text) output.textContent = text;
    });

    return null;
};
