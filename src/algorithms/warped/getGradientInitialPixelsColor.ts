import { P5CanvasInstance } from '@p5-wrapper/react';
import p5 from 'p5';
import { clip } from '../utils/mathFunctions';

export const getGradientInitialPixelsColor = (
    p5: P5CanvasInstance,
    canvasHeight: number,
    canvasWidth: number,
    chaosFactor: number,
) => {
    const out = Array.from(
        { length: canvasWidth },
        () => new Array<p5.Color>(canvasHeight),
    );
    const eps = 1e-6;
    const seedsAmount = clip(
        Math.floor(p5.randomGaussian(chaosFactor, 1)),
        1,
        100,
    );
    const seeds = Array.from({ length: seedsAmount }).map(() => ({
        color: p5.color(
            p5.random(0, 255),
            p5.random(0, 255),
            p5.random(0, 255),
        ),
        x: Math.floor(p5.random(0, canvasWidth)),
        y: Math.floor(p5.random(0, canvasHeight)),
    }));

    for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasHeight; y++) {
            let wr = 0,
                wg = 0,
                wb = 0,
                wa = 0,
                wsum = 0;

            for (const s of seeds) {
                const dx = x - s.x;
                const dy = y - s.y;
                const d = Math.hypot(dx, dy);
                // if exactly on a seed -> take its color
                if (d < eps) {
                    out[x][y] = p5.color(s.color);
                    wsum = -1; // sentinel: already set
                    break;
                }
                const w = 1 / Math.pow(d + eps, 2);

                wr += w * p5.red(s.color);
                wg += w * p5.green(s.color);
                wb += w * p5.blue(s.color);
                wa += w * p5.alpha(s.color);
                wsum += w;
            }

            if (wsum >= 0) {
                out[x][y] = p5.color(
                    wr / wsum,
                    wg / wsum,
                    wb / wsum,
                    wa / wsum,
                );
            }
        }
    }
    return out;
};
