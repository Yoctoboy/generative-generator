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

export function fbm({
    p5,
    x,
    y,
    octaves = 6,
    lacunarity = 2,
    gain = 0.7,
}: {
    p5: P5CanvasInstance;
    x: number;
    y: number;
    octaves?: number;
    lacunarity?: number;
    gain?: number;
}): number {
    let amp = 0.5; // starting amplitude
    let freq = 1.0; // starting frequency
    let sum = 0.0;
    let norm = 0.0;

    for (let i = 0; i < octaves; i++) {
        sum += amp * p5.noise(x * freq, y * freq);
        norm += amp;
        freq *= lacunarity;
        amp *= gain;
    }
    return sum / (norm || 1);
}

/*
 * Return a normalized (around zero) version of fbm to use as offset in fbm chaining
 */
export function fbmOffset({
    p5,
    x,
    y,
    octaves = 6,
    lacunarity = 2,
    gain = 0.7,
}: {
    p5: P5CanvasInstance;
    x: number;
    y: number;
    octaves?: number;
    lacunarity?: number;
    gain?: number;
}): number {
    let amp = 0.5; // starting amplitude
    let freq = 1.0; // starting frequency
    let sum = 0.0;
    let norm = 0.0;

    for (let i = 0; i < octaves; i++) {
        sum += amp * p5.noise(x * freq, y * freq);
        norm += amp;
        freq *= lacunarity;
        amp *= gain;
    }
    return (sum / (norm || 1)) * 2 - 1.0;
}

export const fbmChain = ({
    p5,
    x,
    y,
    octaves = 6,
    lacunarity = 2,
    gain = 0.7,
    chains = 2,
}: {
    p5: P5CanvasInstance;
    x: number;
    y: number;
    octaves?: number;
    lacunarity?: number;
    gain?: number;
    chains?: number;
}) => {
    let offset = 0;
    for (let chain = 0; chain < chains; chain++) {
        offset = fbm({
            p5,
            x: x + offset,
            y: y + offset,
            octaves,
            lacunarity,
            gain,
        });
    }
    return fbm({
        p5,
        x: x + offset,
        y: y + offset,
        octaves,
        lacunarity,
        gain,
    });
};
