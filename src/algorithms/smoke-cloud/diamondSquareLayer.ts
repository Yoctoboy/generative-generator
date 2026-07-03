import { P5CanvasInstance } from '@p5-wrapper/react';

export const generateGreyscaleDiamondSquareLayer = (
    p5: P5CanvasInstance,
    size: number,
) => {
    // global params
    const randomDivision = 2;
    const maxColor = 255;

    // initialize 2D altitude matrix
    const mat = new Array(size).fill(0).map(() => new Array(size).fill(0));

    // diamond-square
    let space = size - 1;
    let halfspace,
        avg,
        s,
        n,
        minalt = 100000.0,
        maxalt = -100000.0,
        result;
    let randomFactor = 100; // kinda useless value since everything is rescaled from 0 to maxColor in the end
    mat[0][0] = p5.random(-randomFactor, randomFactor);
    mat[0][size - 1] = p5.random(-randomFactor, randomFactor);
    mat[size - 1][0] = p5.random(-randomFactor, randomFactor);
    mat[size - 1][size - 1] = p5.random(-randomFactor, randomFactor);
    while (space > 1) {
        halfspace = space / 2;
        // diamond step
        for (let x = halfspace; x < size; x += space) {
            for (let y = halfspace; y < size; y += space) {
                avg =
                    (mat[x - halfspace][y - halfspace] +
                        mat[x - halfspace][y + halfspace] +
                        mat[x + halfspace][y - halfspace] +
                        mat[x + halfspace][y + halfspace]) /
                    4;
                result = avg + p5.random(-randomFactor, randomFactor);
                mat[x][y] = result;
            }
        }

        // square step
        let offset = 0;
        for (let x = 0; x < size; x += halfspace) {
            if (offset == 0) offset = halfspace;
            else offset = 0;
            for (let y = offset; y < size; y += space) {
                s = 0;
                n = 0;
                if (x >= halfspace) {
                    s += mat[x - halfspace][y];
                    n += 1;
                }
                if (x + halfspace < size) {
                    s += mat[x + halfspace][y];
                    n += 1;
                }
                if (y >= halfspace) {
                    s += mat[x][y - halfspace];
                    n += 1;
                }
                if (y + halfspace < size) {
                    s += mat[x][y + halfspace];
                    n += 1;
                }
                avg = s / n;
                result = avg + p5.random(-randomFactor, randomFactor);
                mat[x][y] = result;
            }
        }
        randomFactor /= randomDivision;
        space = halfspace;
    }

    // rescale altitudes between 0 and maxcolor and set pixels accordingly
    for (let x = 0; x < size; x += 1) {
        for (let y = 0; y < size; y += 1) {
            minalt = Math.min(minalt, mat[x][y]);
            maxalt = Math.max(maxalt, mat[x][y]);
        }
    }
    const diamondSquarelayer = new Array(size);
    for (let i = 0; i < size; i++) {
        diamondSquarelayer[i] = new Array(size);
    }
    for (let x = 0; x < size; x += 1) {
        for (let y = 0; y < size; y += 1) {
            mat[x][y] = ((mat[x][y] - minalt) / (maxalt - minalt)) * maxColor;
            diamondSquarelayer[x][y] = Math.floor(mat[x][y]) / 255;
        }
    }
    return diamondSquarelayer;
};
