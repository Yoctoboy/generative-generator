import { P5CanvasInstance } from '@p5-wrapper/react';
import { ParameterValues } from '../../components/Parameter';
import { clip } from '../utils/mathFunctions';
import { createSeededRandom } from '../utils/seededRandom';
import { parameters } from './parameters';

const normalize = (vec: [number, number]): [number, number] => {
    const norm = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    return [vec[0] / norm, vec[1] / norm];
};

export const drawFlowers = (p5: P5CanvasInstance, paramValues: ParameterValues<typeof parameters>, size: number) => {
    const random = createSeededRandom(paramValues['Random Seed']);
    const randomInterval = (min: number, max: number) => {
        return random() * (max - min) + min;
    };

    const brickHeight = paramValues['Brick Height'];
    const brickLength = paramValues['Brick Length'];
    const startHeight = Math.floor((paramValues['Wall Height Start'] * size) / brickHeight) * brickHeight;
    const centerX = size / 2;
    const centerY = startHeight;
    const fullDrawDistanceFromCenter = paramValues['Full Draw Distance'];
    const alphaPerPoint = paramValues['Alpha Per Point'];
    const averagePointWidth = paramValues['Average Point Width'];
    const pointsPerPixel = paramValues['Point Density Per Pixel'];
    const wallBorderWidth = paramValues['Wall Border Width'];
    const gapBetweenFlowers = 40;

    const stemsToDraw = randomInterval(3, 6);
    for (let i = 0; i < stemsToDraw; i++) {
        p5.noFill();
        p5.strokeWeight(8);
        p5.stroke(0);
        const startX = randomInterval(
            size / 2 - fullDrawDistanceFromCenter / 2,
            size / 2 + fullDrawDistanceFromCenter / 2,
        );
        const startY = startHeight;
        let curAngle: [number, number] = normalize([p5.random() < 0.5 ? -1 : 1, p5.random() - 1]);
        p5.beginShape();
        p5.vertex(startX, startY);
        let curX = startX,
            curY = startY;
        let lastFlowerStep = -Infinity;
        const flowersList: [number, number, [number, number]][] = [];
        const stemSteps = randomInterval(400, 700);
        for (let step = 0; step < stemSteps; step++) {
            curX += curAngle[0];
            curY += curAngle[1];
            // console.log(curAngle);
            p5.vertex(curX, curY);
            curAngle = normalize([
                curAngle[0] + (p5.noise(curX / 500, curY / 500, i) - 0.5) / 10,
                curAngle[1] + (p5.noise(curX / 500, curY / 500, i + 10) - 0.5) / 10 + 0.05,
            ]);
            if (step - lastFlowerStep > gapBetweenFlowers && random() < 0.04) {
                lastFlowerStep = step;
                flowersList.push([curX, curY, curAngle]);
            }
        }
        p5.endShape();

        // draw all flowers on the stem
        for (let i = 0; i < flowersList.length; i++) {
            p5.stroke(0);
            p5.strokeWeight(4);
            p5.noFill();
            const flower = flowersList[i];
            const tempAngle = p5
                .createVector(flower[2][0], flower[2][1])
                .rotate(random() < 0.5 ? p5.HALF_PI : -p5.HALF_PI);
            let curAngle = [tempAngle.x, tempAngle.y];
            const steps = randomInterval(20, 60);
            let curX = flower[0],
                curY = flower[1];
            p5.beginShape();
            for (let step = 0; step < steps; step++) {
                curX += curAngle[0];
                curY += curAngle[1];
                p5.vertex(curX, curY);
                curAngle = normalize([
                    curAngle[0] + (p5.noise(curX / 500, curY / 500, i + 20) - 0.5) / 10,
                    curAngle[1] + (p5.noise(curX / 500, curY / 500, i + 300) - 0.5) / 10 + 0.03,
                ]);
            }
            p5.endShape();
            p5.stroke(190, 0, 0);
            p5.fill(190, 0, 0);
            p5.circle(curX, curY, randomInterval(10, 25));
        }
    }
};
