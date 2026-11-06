import { P5CanvasInstance } from '@p5-wrapper/react';
import { ParameterValues } from '../../components/Parameter';
import { createSeededRandom } from '../utils/seededRandom';
import { drawPetals } from './drawPetals';
import { parameters } from './parameters';

const normalize = (vec: [number, number]): [number, number] => {
    const norm = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    return [vec[0] / norm, vec[1] / norm];
};

const rotateDirectionDegrees = (initialDirection: [number, number], rotationInDegrees: number): [number, number] => {
    const [x, y] = initialDirection;
    const theta = (rotationInDegrees * Math.PI) / 180;
    return [x * Math.cos(theta) - y * Math.sin(theta), x * Math.sin(theta) + y * Math.cos(theta)];
};

const weightedDirectionAverage = (directions: [number, number][], amounts: number[]): [number, number] => {
    let summedDirection: [number, number] = [0, 0];
    for (let i = 0; i < directions.length; i++) {
        summedDirection = [
            summedDirection[0] + amounts[i] * directions[i][0],
            summedDirection[1] + amounts[i] * directions[i][1],
        ];
    }
    return normalize(summedDirection);
};

const DIST_BETWEEN_LEAF_POINTS = 2;

// beginClip / endClip exist since p5 1.9 but are missing from @types/p5 1.7.x
type ClippableP5 = P5CanvasInstance & {
    beginClip: (options?: { invert?: boolean }) => void;
    endClip: () => void;
};

export const drawFlowers = (p5: P5CanvasInstance, paramValues: ParameterValues<typeof parameters>, size: number) => {
    const random = createSeededRandom(paramValues['Random Seed']);
    const randomInterval = (min: number, max: number) => {
        return random() * (max - min) + min;
    };

    const brickHeight = paramValues['Brick Height'];
    // const brickLength = paramValues['Brick Length'];
    const startHeight = Math.floor((paramValues['Wall Height Start'] * size) / brickHeight) * brickHeight;
    const fullDrawDistanceFromCenter = paramValues['Full Draw Distance'];
    // const centerX = size / 2;
    // const centerY = startHeight;
    // const alphaPerPoint = paramValues['Alpha Per Point'];
    // const averagePointWidth = paramValues['Average Point Width'];
    // const pointsPerPixel = paramValues['Point Density Per Pixel'];
    // const wallBorderWidth = paramValues['Wall Border Width'];
    const gapBetweenFlowers = 40;

    const petals: [number, number, number, [number, number]][] = [];
    const stemsToDraw = randomInterval(3, 6);

    for (let i = 0; i < stemsToDraw; i++) {
        p5.stroke(0);
        const stemWidthStart = p5.random(6, 10);
        const stemWidthEnd = p5.random(2, 3);
        const startX = randomInterval(
            size / 2 - fullDrawDistanceFromCenter / 2,
            size / 2 + fullDrawDistanceFromCenter / 2,
        );
        const startY = startHeight - 2;
        let curDirection: [number, number] = normalize([p5.random() < 0.5 ? -1 : 1, p5.random() / 2 - 0.7]);
        let curX = startX,
            curY = startY;
        let lastFlowerStep = 0;
        const flowersList: [number, number, [number, number]][] = [];
        const stemSteps = randomInterval(400, 600);
        for (let step = 0; step < stemSteps; step++) {
            const prevX = curX,
                prevY = curY;
            curX += curDirection[0];
            curY += curDirection[1];
            p5.strokeWeight(p5.lerp(stemWidthStart, stemWidthEnd, Math.pow(step / stemSteps, 5)));
            p5.line(prevX, prevY, curX, curY);
            const gravityFactor = p5.lerp(0.05, 0.7, step / stemSteps);
            curDirection = normalize([
                curDirection[0] + (p5.noise(curX / 500, curY / 500, i) - 0.5) / 10,
                curDirection[1] + (p5.noise(curX / 500, curY / 500, i + 10) - 0.5) / 10 + gravityFactor,
            ]);
            if (step - lastFlowerStep > gapBetweenFlowers && random() < 0.04) {
                lastFlowerStep = step;
                flowersList.push([curX, curY, curDirection]);
            }
        }

        // draw all flowers mini-stems starting from the main stem
        for (let i = 0; i < flowersList.length; i++) {
            const miniStemWidthStart = p5.random(3, 4.5);
            const miniStemWidthEnd = 1.5;
            p5.stroke(0);
            const flower = flowersList[i];
            const tempDirection = p5
                .createVector(flower[2][0], flower[2][1])
                .rotate(random() < 0.5 ? p5.HALF_PI : -p5.HALF_PI);
            let curDirection = [tempDirection.x, tempDirection.y];
            const steps = randomInterval(20, 60);
            let curX = flower[0],
                curY = flower[1];
            for (let step = 0; step < steps; step++) {
                const prevX = curX,
                    prevY = curY;
                curX += curDirection[0];
                curY += curDirection[1];
                p5.strokeWeight(p5.lerp(miniStemWidthStart, miniStemWidthEnd, step / steps));
                p5.line(prevX, prevY, curX, curY);
                curDirection = normalize([
                    curDirection[0] + (p5.noise(curX / 500, curY / 500, i + 20) - 0.5) / 10,
                    curDirection[1] + (p5.noise(curX / 500, curY / 500, i + 300) - 0.5) / 10 + 0.03,
                ]);
            }
            petals.push([curX, curY, p5.random(size / 100, size / 65), [curDirection[0], curDirection[1]]]);
        }
    }

    const clippable = p5 as ClippableP5;
    p5.push();
    clippable.beginClip();
    for (const [x, y, leafTipDistanceFromStem, normalizedDirection] of petals) {
        const leafTipCoordinates = [
            x + normalizedDirection[0] * leafTipDistanceFromStem,
            y + normalizedDirection[1] * leafTipDistanceFromStem,
        ];
        // trace both sides of the leaf from the base to the tip
        const absoluteInitialDirection = p5.random(40, 115);
        const leafSides: [number, number][][] = [];
        for (const initialDirection of [-absoluteInitialDirection, absoluteInitialDirection]) {
            let currentDirection = rotateDirectionDegrees(normalizedDirection, initialDirection);
            let currentPoint: [number, number] = [x, y];
            const sidePoints: [number, number][] = [currentPoint];
            while (p5.dist(currentPoint[0], currentPoint[1], leafTipCoordinates[0], leafTipCoordinates[1]) > 2) {
                // new point = old point translated with currentDirection (using a fixes distance)
                currentPoint = [
                    currentPoint[0] + currentDirection[0] * DIST_BETWEEN_LEAF_POINTS,
                    currentPoint[1] + currentDirection[1] * DIST_BETWEEN_LEAF_POINTS,
                ];
                sidePoints.push(currentPoint);
                // new direction = weighted average between old direction, direction towards the tip, and direction towards the mid line of the leaf
                const directionTowardsTip = normalize([
                    leafTipCoordinates[0] - currentPoint[0],
                    leafTipCoordinates[1] - currentPoint[1],
                ]);
                // project the current point onto the mid line (base + t * normalizedDirection) to find its closest point
                const t =
                    (currentPoint[0] - x) * normalizedDirection[0] + (currentPoint[1] - y) * normalizedDirection[1];
                const directionTowardsLeafMidLine = normalize([
                    x + normalizedDirection[0] * t - currentPoint[0],
                    y + normalizedDirection[1] * t - currentPoint[1],
                ]);
                // 2D cross product of (base → currentPoint) with the unit mid line direction
                const distanceFromCurrentPointToMidLine = Math.abs(
                    (currentPoint[0] - x) * normalizedDirection[1] - (currentPoint[1] - y) * normalizedDirection[0],
                );
                currentDirection = weightedDirectionAverage(
                    [currentDirection, directionTowardsTip, directionTowardsLeafMidLine],
                    [10, 10 / distanceFromCurrentPointToMidLine, 1],
                );
            }
            leafSides.push(sidePoints);
        }

        // a single closed loop (up one side, down the other) so every leaf winds the same way:
        // the clip uses the nonzero rule, where overlapping opposite windings cancel into holes
        const leafOutline: [number, number][] = [
            ...leafSides[0],
            [leafTipCoordinates[0], leafTipCoordinates[1]],
            ...leafSides[1].reverse(),
        ];
        // p5 doesn't start a new subpath per shape while clipping, so consecutive
        // leaves get joined by straight lines unless we move to each outline's start point
        p5.drawingContext.moveTo(leafOutline[0][0], leafOutline[0][1]);
        p5.beginShape();
        for (const [px, py] of leafOutline) {
            p5.vertex(px, py);
        }
        p5.endShape(p5.CLOSE);
    }
    clippable.endClip();
    // the clip edge is antialiased on every draw call, so drawing the ~100 translucent layers directly
    // through it accumulates fringe pixels: render offscreen, then blit once through the clip
    const petalsBuffer = p5.createGraphics(size, size) as P5CanvasInstance;
    drawPetals(petalsBuffer, {
        ...paramValues,
        'Deformation steps': 7,
        'Layers per source': 80,
        'Randomization Amount': 500,
        Sources: 5,
    });
    p5.image(petalsBuffer as unknown as Parameters<typeof p5.image>[0], 0, 0);
    petalsBuffer.remove();
    p5.pop();
};
