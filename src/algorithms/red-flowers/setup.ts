import { P5CanvasInstance } from '@p5-wrapper/react';
import { ParameterValues } from '../../components/Parameter';
import { drawWall } from './drawWall';
import { parameters } from './parameters';

export const setup = (p5: P5CanvasInstance, paramValues: ParameterValues<typeof parameters>) => {
    return () => {
        drawWall(p5, paramValues);
    };
};
