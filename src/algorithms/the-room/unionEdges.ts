import * as THREE from 'three';
import { ADDITION, Brush, Evaluator } from 'three-bvh-csg';
import { WallBoxProps } from './WallBox';

const evaluator = new Evaluator();
evaluator.attributes = ['position', 'normal'];
evaluator.useGroups = false;

// The CSG result is expressed in the local frame of its first operand, so the
// position is baked into the geometry and every brush stays at the origin
const boxToBrush = ({ x, y, z, width, height, depth }: WallBoxProps) => {
    const geometry = new THREE.BoxGeometry(width, height, depth).translate(
        x + width / 2,
        y + height / 2,
        z + depth / 2,
    );
    const brush = new Brush(geometry);
    brush.updateMatrixWorld();
    return brush;
};

// Union brushes pairwise (like a merge sort) rather than one by one, so the
// accumulated mesh doesn't get re-processed for every single box
const unionAll = (brushes: Brush[]): Brush => {
    if (brushes.length === 1) return brushes[0];
    const mid = Math.floor(brushes.length / 2);
    const result = evaluator.evaluate(
        unionAll(brushes.slice(0, mid)),
        unionAll(brushes.slice(mid)),
        ADDITION,
    );
    return result;
};

// The CSG output has T-junctions (triangle edges that don't line up with their
// neighbours'), which EdgesGeometry reports as edges, drawing the diagonals of
// split faces. Every real edge of a union of axis-aligned boxes is itself
// axis-aligned, so any segment that isn't can be dropped
const keepAxisAlignedSegments = (edges: THREE.BufferGeometry) => {
    const pos = edges.getAttribute('position');
    const kept: number[] = [];
    const EPSILON = 1e-4;
    for (let i = 0; i < pos.count; i += 2) {
        const dx = Math.abs(pos.getX(i + 1) - pos.getX(i));
        const dy = Math.abs(pos.getY(i + 1) - pos.getY(i));
        const dz = Math.abs(pos.getZ(i + 1) - pos.getZ(i));
        const movingAxes = [dx, dy, dz].filter((d) => d > EPSILON).length;
        if (movingAxes === 1) {
            kept.push(
                pos.getX(i), pos.getY(i), pos.getZ(i),
                pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1),
            );
        }
    }
    const filtered = new THREE.BufferGeometry();
    filtered.setAttribute('position', new THREE.Float32BufferAttribute(kept, 3));
    return filtered;
};

// Edges of the union of all boxes: box outlines that stay on the surface,
// plus the new creases where overlapping boxes cut through each other.
// Assumes the boxes are axis-aligned (true in a wall's local space)
export const unionEdges = (boxes: WallBoxProps[], thresholdAngle = 1) => {
    if (boxes.length === 0) return new THREE.BufferGeometry();
    const union = unionAll(boxes.map(boxToBrush));
    return keepAxisAlignedSegments(
        new THREE.EdgesGeometry(union.geometry, thresholdAngle),
    );
};
