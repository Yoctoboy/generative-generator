import { P5CanvasInstance } from '@p5-wrapper/react';
import { Image } from 'p5';
import {
    Parameter,
    ParameterType,
    ParameterValues,
} from '../../components/Parameter';
import {
    Pixel,
    PixelMatrix,
    PixelMatrixObjectType,
} from '../utils/PixelMatrix';
import { randomInterval } from '../utils/mathFunctions';
import { tintColor } from '../utils/tintColor';

// import backgroundImage from './assets/face_2_687_1031.jpg';
// const canvasWidth = 687;
// const canvasHeight = 1031;

// import backgroundImage from './assets/joren-aranas-662-992.jpg';
// const canvasWidth = 661;
// const canvasHeight = 991;

// import backgroundImage from './assets/ramiro-pianarosa-662-999.jpg';
// const canvasWidth = 662;
// const canvasHeight = 999;

// import backgroundImage from './assets/duncan-lewis-750-1000.jpg';
// const canvasWidth = 750;
// const canvasHeight = 1000;

import backgroundImage from './assets/sergio-rola-750-1000.jpg';
const canvasWidth = 750;
const canvasHeight = 1000;

let img: Image;

export const parameters = [
    {
        name: 'Smallest glitch height',
        minValue: 1,
        maxValue: 50,
        initialValue: 5,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Biggest glitch height',
        minValue: 1,
        maxValue: 50,
        initialValue: 12,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Preserve color?',
        initialValue: false,
        type: ParameterType.CHECKBOX,
    },
] as const satisfies Parameter[];

export const preload = (p5: P5CanvasInstance) => {
    return () => {
        try {
            img = p5.loadImage(backgroundImage);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };
};

const getImagePixels = () => {
    img.loadPixels();
    const flatPixels: Uint8ClampedArray = img.pixels;
    const imgPixels: PixelMatrixObjectType = new Array(canvasHeight);
    for (let i = 0; i < canvasHeight; i++) {
        imgPixels[i] = [];
        for (let j = 0; j < canvasWidth; j++) {
            imgPixels[i].push(
                flatPixels.subarray(
                    i * 4 * canvasWidth + 4 * j,
                    i * 4 * canvasWidth + 4 * j + 4,
                ) as unknown as Pixel,
            );
        }
    }
    return imgPixels;
};

export const setup = (
    p5: P5CanvasInstance,
    paramValues: ParameterValues<typeof parameters>,
) => {
    return () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        p5.noLoop();
        p5.smooth();
        p5.blendMode(p5.ADD);
        p5.colorMode(p5.RGB);

        p5.image(img, 0, 0, canvasWidth, canvasHeight);

        const imagePixels = getImagePixels();
        const pixelMatrix = new PixelMatrix(imagePixels);

        p5.background(0);

        const targetColor = paramValues['Preserve color?']
            ? p5.color(255)
            : p5.color(
                  randomInterval(50, 255),
                  randomInterval(50, 255),
                  randomInterval(50, 255),
                  255,
              );
        let curY = 0;
        let lastY = 0;
        while (curY < canvasHeight) {
            lastY =
                curY +
                Math.round(
                    randomInterval(
                        paramValues['Smallest glitch height'],
                        paramValues['Biggest glitch height'],
                    ),
                );
            const offset = Math.round(randomInterval(0, 0));

            // set all pixels with offset
            for (let x = offset; x < canvasWidth + offset; x++) {
                for (let y = curY; y < lastY; y++) {
                    const initialPixelValue = pixelMatrix.get(y, x);
                    const initialColor = p5.color(
                        initialPixelValue[0],
                        initialPixelValue[1],
                        initialPixelValue[2],
                        initialPixelValue[3],
                    );
                    const newColor = tintColor({
                        p5,
                        initialColor,
                        targetColor,
                    });
                    p5.set(x - offset, y, newColor);
                }
            }
            curY = lastY;
        }

        p5.updatePixels();
    };
};
