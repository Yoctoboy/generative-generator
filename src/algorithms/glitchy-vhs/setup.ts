import { P5CanvasInstance } from '@p5-wrapper/react';
import { Image } from 'p5';
import { Pixel, PixelMatrixObjectType } from '../utils/PixelMatrix';
import { randomInterval } from '../utils/mathFunctions';
import backgroundImage from './assets/face_2_687_1031.jpg';

let img: Image;
const canvasWidth = 687;
const canvasHeight = 1031;

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

export const setup = (p5: P5CanvasInstance) => {
    return () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        p5.noLoop();
        p5.smooth();
        p5.blendMode(p5.BLEND);

        p5.image(img, 0, 0, canvasWidth, canvasHeight);

        const imagePixels = getImagePixels();

        const rectangleHeightInPx = randomInterval(8, 18);
        const rectangleIndex = 0;

        while (rectangleIndex * rectangleHeightInPx < canvasHeight) {
            const absoluteOffset = randomInterval(5, 15);
            const offset =
                rectangleIndex % 2 === 0 ? -absoluteOffset : absoluteOffset;

            // set all pixels
        }
    };
};
