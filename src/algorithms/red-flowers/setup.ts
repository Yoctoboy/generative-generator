import { P5CanvasInstance } from '@p5-wrapper/react';
import { ParameterValues } from '../../components/Parameter';
import { seedRandomnessModules } from '../utils/seedRandomnessModules';
import { drawFlowers } from './drawFlowers';
import { drawWall } from './drawWall';
import { parameters } from './parameters';

export const setup = (p5: P5CanvasInstance, paramValues: ParameterValues<typeof parameters>) => {
    return () => {
        const size = 2048;
        p5.createCanvas(size, size);
        p5.background(255);
        seedRandomnessModules(p5, paramValues['Random Seed']);

        drawWall(p5, paramValues, size);
        drawFlowers(p5, paramValues, size);
    };
};
