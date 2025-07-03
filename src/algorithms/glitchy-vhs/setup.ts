import { P5CanvasInstance } from '@p5-wrapper/react';
import { Image } from 'p5';
import {
    Parameter,
    ParameterType,
    ParameterValues,
    randomSeedParameter,
} from '../../components/Parameter';
import {
    Pixel,
    PixelMatrix,
    PixelMatrixObjectType,
} from '../utils/PixelMatrix';
import { tintColor } from '../utils/tintColor';

// TODO: make a parameter for that or something
// import backgroundImage from './assets/face_2_687_1031.jpg';
// import backgroundImage from './assets/joren-aranas-662-992.jpg';
// import backgroundImage from './assets/ramiro-pianarosa-662-999.jpg';
// import backgroundImage from './assets/duncan-lewis-750-1000.jpg';
import backgroundImage from './assets/sergio-rola-750-1000.jpg';

let canvasWidth: number;
let canvasHeight: number;

let img: Image;

export const parameters = [
    randomSeedParameter,
    {
        name: 'Min glitch height',
        minValue: 1,
        maxValue: 50,
        initialValue: 8,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Max glitch height',
        minValue: 1,
        maxValue: 800,
        initialValue: 400,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Max offset size',
        minValue: 4,
        maxValue: 50,
        initialValue: 10,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Grain amount',
        minValue: 0,
        maxValue: 100,
        initialValue: 10,
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
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                flatPixels.subarray(
                    i * 4 * canvasWidth + 4 * j,
                    i * 4 * canvasWidth + 4 * j + 4,
                ) as unknown as Pixel,
            );
        }
    }
    return imgPixels;
};

const offsetPixels = (
    p5: P5CanvasInstance,
    paramValues: ParameterValues<typeof parameters>,
    pixelMatrix: PixelMatrix,
) => {
    const targetColor = paramValues['Preserve color?']
        ? p5.color(255)
        : p5.color(
              p5.random(0, 255),
              p5.random(0, 255),
              p5.random(0, 255),
              255,
          );
    let curY = 0;
    let lastY = 0;

    while (curY < canvasHeight) {
        lastY =
            curY +
            Math.round(
                p5.random(
                    paramValues['Min glitch height'],
                    paramValues['Max glitch height'],
                ),
            );
        const offset = Math.round(
            p5.random(
                -paramValues['Max offset size'],
                paramValues['Max offset size'],
            ),
        );

        // set all pixels with offset
        for (let x = 0; x < canvasWidth; x++) {
            for (let y = curY; y < lastY; y++) {
                const initialPixelValue = pixelMatrix.get(y, x + offset);
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
                    amount: 0.2,
                });
                p5.set(x, y, newColor);
            }
        }
        curY = lastY;
    }

    p5.updatePixels();
};

const addGrain = (
    p5: P5CanvasInstance,
    paramValues: ParameterValues<typeof parameters>,
) => {
    const currentPixels = p5.get();

    for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasHeight; y++) {
            const pix = currentPixels.get(x, y);
            const initialColor = p5.color(pix[0], pix[1], pix[2], pix[3]);
            const targetColor = p5.color(
                p5.random() * 255,
                p5.random() * 255,
                p5.random() * 255,
                p5.random() * 255,
            );
            const newColor = tintColor({
                p5,
                initialColor,
                targetColor,
                amount: paramValues['Grain amount'] / 100,
            });
            p5.set(x, y, newColor);
        }
    }
    p5.updatePixels();
};

export const setup = (
    p5: P5CanvasInstance,
    paramValues: ParameterValues<typeof parameters>,
) => {
    return () => {
        // image is loaded at this point, so we can find out its size
        canvasHeight = img.height;
        canvasWidth = img.width;

        p5.createCanvas(canvasWidth, canvasHeight);
        p5.noLoop();
        p5.smooth();
        p5.blendMode(p5.ADD);
        p5.colorMode(p5.RGB);
        p5.image(img, 0, 0, canvasWidth, canvasHeight);

        const imagePixels = getImagePixels();
        const pixelMatrix = new PixelMatrix(imagePixels);

        p5.background(0);

        // Pixel offsets
        offsetPixels(p5, paramValues, pixelMatrix);

        // RGB separation
        // TODO: RGB separation

        // Grain
        addGrain(p5, paramValues);
    };
};
