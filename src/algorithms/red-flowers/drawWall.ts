import { P5CanvasInstance } from '@p5-wrapper/react';
import { ParameterValues } from '../../components/Parameter';
import { clip } from '../utils/mathFunctions';
import { seedRandomnessModules } from '../utils/seedRandomnessModules';
import { createSeededRandom } from '../utils/seededRandom';
import { parameters } from './parameters';

export const drawWall = (p5: P5CanvasInstance, paramValues: ParameterValues<typeof parameters>, size: number) => {
    const random = createSeededRandom(paramValues['Random Seed']);
    const randomInterval = (min: number, max: number) => {
        return random() * (max - min) + min;
    };
    const randomAround = (value: number, ratio = 0.5) => {
        return randomInterval(value * ratio, value / ratio);
    };
    seedRandomnessModules(p5, paramValues['Random Seed']);

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

    const getDistanceFromBrickBorder = (x: number, y: number) => {
        const distanceY = Math.min(y % brickHeight, brickHeight - (y % brickHeight));
        const distanceX =
            Math.floor(y / brickHeight) % 2 == 0
                ? Math.min(x % brickLength, brickLength - (x % brickLength))
                : Math.min((x + brickLength / 2) % brickLength, brickLength - ((x + brickLength / 2) % brickLength));
        return Math.min(distanceX, distanceY);
    };
    p5.stroke(0, 0, 0, alphaPerPoint);
    for (let j = 0; j < size; j++) {
        for (let i = startHeight - 2; i < size; i++) {
            const distanceFromCenter = Math.sqrt((j - centerX) * (j - centerX) + (i - centerY) * (i - centerY));
            const fromCenterProbability =
                distanceFromCenter < fullDrawDistanceFromCenter
                    ? 1
                    : 1 / (1 + Math.exp((distanceFromCenter - fullDrawDistanceFromCenter) / 70));
            const distanceFromBrickBorder = getDistanceFromBrickBorder(j, i);
            const fromBrickBorderProbability = clip(Math.pow(wallBorderWidth / distanceFromBrickBorder, 3), 0, 1);
            for (let k = 0; k < pointsPerPixel; k++) {
                const willDrawPointHere = random() < fromBrickBorderProbability * fromCenterProbability;
                if (willDrawPointHere) {
                    p5.strokeWeight(randomAround(averagePointWidth, 0.7));
                    p5.point(j, i);
                }
            }
        }
    }
};
