import { P5CanvasInstance } from '@p5-wrapper/react';
import { Image } from 'p5';
import { ParameterValues } from '../../components/Parameter';
import {
    Pixel,
    PixelMatrix,
    PixelMatrixObjectType,
} from '../utils/PixelMatrix';
import { tintColor } from '../utils/tintColor';
import { parameters } from './parameters';

const getImagePixels = (img: Image, p5: P5CanvasInstance) => {
    img.loadPixels();
    const flatPixels: Uint8ClampedArray = img.pixels;
    const imgPixels: PixelMatrixObjectType = new Array(p5.height);
    for (let i = 0; i < p5.height; i++) {
        imgPixels[i] = [];
        for (let j = 0; j < p5.width; j++) {
            imgPixels[i].push(
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                flatPixels.subarray(
                    i * 4 * p5.width + 4 * j,
                    i * 4 * p5.width + 4 * j + 4,
                ) as unknown as Pixel,
            );
        }
    }
    return imgPixels;
};

export const glitchSideways = ({
    img,
    p5,
    paramValues,
}: {
    img: Image;
    p5: P5CanvasInstance;
    paramValues: ParameterValues<typeof parameters>;
}) => {
    const imagePixels = getImagePixels(img, p5);
    const pixelMatrix = new PixelMatrix(imagePixels);

    p5.background(0);

    const targetColor = paramValues['Preserve color?']
        ? p5.color(255)
        : p5.color(
              p5.random(50, 255),
              p5.random(50, 255),
              p5.random(50, 255),
              255,
          );
    let curY = 0;
    let lastY = 0;

    while (curY < p5.height) {
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
        for (let x = 0; x < p5.width; x++) {
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
                });
                p5.set(x, y, newColor);
            }
        }
        curY = lastY;
    }

    p5.updatePixels();
};
