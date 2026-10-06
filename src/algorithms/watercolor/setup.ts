import { P5CanvasInstance } from '@p5-wrapper/react';
import { Parameter, ParameterType, ParameterValues, randomSeedParameter } from '../../components/Parameter';
import { createSeededRandom } from '../utils/seededRandom';

export const parameters = [
    randomSeedParameter,
    {
        name: 'Deformation steps',
        minValue: 0,
        maxValue: 20,
        initialValue: 7,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Layers',
        minValue: 1,
        maxValue: 200,
        initialValue: 80,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Randomization Amount',
        minValue: 1,
        maxValue: 500,
        initialValue: 10,
        step: 1,
        type: ParameterType.SLIDER,
    },
] as const satisfies Parameter[];

export const setup = (p5: P5CanvasInstance, paramValues: ParameterValues<typeof parameters>) => {
    const random = createSeededRandom(paramValues['Random Seed']);

    class Coords {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        randomize(amount: number) {
            return new Coords(this.x + random() * amount - amount / 2, this.y + random() * amount - amount / 2);
        }

        average(c: Coords) {
            return new Coords((this.x + c.x) / 2, (this.y + c.y) / 2);
        }
    }

    return () => {
        const size = 1024;
        p5.background(0);
        p5.createCanvas(size, size);
        const initialCoords: Coords[] = [
            new Coords(size / 3, size / 3),
            new Coords((2 * size) / 3, size / 3),
            new Coords((2 * size) / 3, (2 * size) / 3),
            new Coords(size / 3, (2 * size) / 3),
        ];
        p5.noStroke();
        p5.fill(255, 165, 0, 255 / paramValues['Layers']);
        for (let layer = 0; layer < paramValues['Layers']; layer++) {
            let coords = [...initialCoords];
            for (let s = 0; s < paramValues['Deformation steps']; s++) {
                const newCoords = [];
                for (let i = 0; i < 4 * Math.pow(2, s); i++) {
                    const avg = coords[i]
                        .average(coords[(i + 1) % coords.length])
                        .randomize(paramValues['Randomization Amount'] / Math.pow(2, s));
                    newCoords.push(avg);
                    newCoords.push(
                        coords[(i + 1) % coords.length].randomize(paramValues['Randomization Amount'] / Math.pow(2, s)),
                    );
                }
                coords = newCoords;
            }
            p5.beginShape();
            for (const coord of coords) {
                p5.vertex(coord.x, coord.y);
            }
            p5.endShape(p5.CLOSE);
        }
    };
};
