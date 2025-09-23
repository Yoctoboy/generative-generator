import { P5CanvasInstance } from '@p5-wrapper/react';
/*
 * WARNING
 *
 * These RNGs are unseeded.
 */

export const randomExponential = (lambda: number) => {
    const randomUniform = Math.random();
    return -Math.log(randomUniform) / lambda;
};

export const randomExponentialAvg = (avg: number) => {
    const randomUniform = Math.random();
    return -Math.log(randomUniform) * avg;
};

export const randomInterval = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

export const randInt = (min: number, max: number) => {
    // random integer between min and max (included)
    return Math.floor(Math.random() * (max + 1 - min) + min);
};

export const randomAround = (value: number, ratio = 0.5) => {
    return randomInterval(value * ratio, value / ratio);
};

export const percentage = (
    partialValue: number,
    totalValue: number,
    round = 2,
) => {
    return (
        Math.round(((100 * partialValue) / totalValue) * Math.pow(10, round)) /
        Math.pow(10, round)
    );
};

export const invertPercentage = (
    partialValue: number,
    totalValue: number,
    round = 2,
) => {
    return (
        100 -
        Math.round(((100 * partialValue) / totalValue) * Math.pow(10, round)) /
            Math.pow(10, round)
    );
};

export const clip = (value: number, min: number, max: number) => {
    return Math.min(Math.max(min, value), max);
};

export const poweredClip = (
    value: number,
    min: number,
    max: number,
    power = 2,
) => {
    return Math.max(
        Math.min(
            Math.pow(Math.min(Math.max(min, value), max), power) /
                Math.pow(max, power - 1),
            max,
        ),
        min,
    );
};

export function gaussianFunction(mu: number, sigma: number, x: number) {
    return (
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2))
    );
}

export function fbm(p5: P5CanvasInstance, x: number, y: number, H: number) {
    const octaves = 8;
    let res = 0;

    for (let i = 0; i < octaves; i++) {
        const f = Math.pow(2, i);
        const a = Math.pow(f, -H);
        res += a * p5.noise(0.01 * f * x, 0.01 * f * y);
    }
    if (Math.random() < 0.00001) console.log(res);
    return res;
}
