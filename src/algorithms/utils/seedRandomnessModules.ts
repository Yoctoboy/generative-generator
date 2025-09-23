import { P5CanvasInstance } from '@p5-wrapper/react';

export const seedRandomnessModules = (
    p5: P5CanvasInstance,
    randomSeed?: number,
) => {
    const random_seed = randomSeed ?? Math.floor(p5.random(0, 900000));
    p5.randomSeed(random_seed);
    const perlin_seed = randomSeed ?? Math.floor(p5.random(0, 900000));
    p5.noiseSeed(perlin_seed);
    console.log(`Random seed = ${random_seed} / Perlin seed = ${perlin_seed}`);
};
