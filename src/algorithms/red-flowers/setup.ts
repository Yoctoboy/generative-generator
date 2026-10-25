import { P5CanvasInstance } from '@p5-wrapper/react';
import { Parameter, ParameterType, ParameterValues, randomSeedParameter } from '../../components/Parameter';
import { seedRandomnessModules } from '../utils/seedRandomnessModules';
import { createSeededRandom } from '../utils/seededRandom';

export const parameters = [
    randomSeedParameter,
    // {
    //     name: 'test',
    //     minValue: 1,
    //     maxValue: 50,
    //     initialValue: 8,
    //     step: 1,
    //     type: ParameterType.SLIDER,
    // },
] as const satisfies Parameter[];

export const setup = (p5: P5CanvasInstance, paramValues: ParameterValues<typeof parameters>) => {
    return () => {
        const random = createSeededRandom(paramValues['Random Seed']);
        const randomInterval = (min: number, max: number) => {
            return random() * (max - min) + min;
        };
        const randomAround = (value: number, ratio = 0.5) => {
            return randomInterval(value * ratio, value / ratio);
        };
        seedRandomnessModules(p5, paramValues['Random Seed']);

        const size = 1024;
        p5.createCanvas(size, size);
        p5.background(255);

        const brickHeight = 20;
        const brickLength = 50;
        const startHeight = Math.floor(0.45 * size);
        const centerX = size / 2;
        const centerY = startHeight;
        const fullDrawDistanceFromCenter = 150;
        const shallowDrawDistanceFromFull = 100;
        const pointDensityPerPixel = 3;
        const alphaPerPoint = 70;
        const averagePointWidth = 3;
        p5.stroke(0, 0, 0, alphaPerPoint);
        for (let j = 0; j < size; j++) {
            for (let i = startHeight; i < size + 1; i++) {
                const distanceFromCenter = Math.sqrt((j - centerX) * (j - centerX) + (i - centerY) * (i - centerY));
                const distanceFromClosestBrickBorder = 0; // todo;
                if (distanceFromCenter > fullDrawDistanceFromCenter + shallowDrawDistanceFromFull) {
                    continue;
                }
                console.log(distanceFromCenter);
                const probabilityToDrawPoint =
                    distanceFromCenter < fullDrawDistanceFromCenter
                        ? 1
                        : (distanceFromCenter - fullDrawDistanceFromCenter) / shallowDrawDistanceFromFull;
                const willDrawPointHere = p5.random() < probabilityToDrawPoint;
                if (willDrawPointHere) {
                    const pointWidth = randomAround(averagePointWidth, 0.3);
                    p5.strokeWeight(pointWidth);
                    p5.point(j, i);
                    console.log('drawing at', j, ' ', i);
                }
            }
        }
    };
};
