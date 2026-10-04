import { P5CanvasInstance } from '@p5-wrapper/react';
import { Parameter, ParameterValues, randomSeedParameter } from '../../components/Parameter';
import { createSeededRandom } from '../utils/seededRandom';

export const parameters = [randomSeedParameter] as const satisfies Parameter[];

export const setup = (p5: P5CanvasInstance, paramValues: ParameterValues<typeof parameters>) => {
    const size = 1512;
    const startBigMulti = 0.4 * size;
    const endBigMulti = 0.6 * size;
    const baseMulti = 10;
    const maxMulti = 150;
    const slope = 2;
    const getNoiseMultiplicatorForX = (x: number) => {
        if (x < startBigMulti || x > endBigMulti) return baseMulti;
        else
            return Math.max(
                baseMulti,
                Math.min(maxMulti, Math.abs((x - startBigMulti) * slope), Math.abs((x - endBigMulti) * slope)),
            );
    };

    return () => {
        p5.createCanvas(size, size);
        p5.fill(0); // so lower mountains hide mountains that are "behind"
        p5.background(0);
        p5.stroke(255);
        p5.strokeWeight(2);

        const random = createSeededRandom(paramValues['Random Seed']);
        const startVertical = 0.3 * size;
        const endVertical = 0.7 * size;
        const startHorizontal = 0.3 * size;
        const endHorizontal = 0.7 * size;
        for (let x = startVertical; x < endVertical; x += 10) {
            p5.beginShape();
            let offset = random() * 1000;
            for (let i = startHorizontal; i < endHorizontal; i++) {
                const noiseMultiplicator = getNoiseMultiplicatorForX(i);
                const y = x - noiseMultiplicator * p5.noise(offset);
                p5.vertex(i, y);
                offset += 0.015;
            }
            p5.endShape();
        }
    };
};
