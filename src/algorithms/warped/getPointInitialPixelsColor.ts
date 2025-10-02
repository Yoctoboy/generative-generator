import { P5CanvasInstance } from '@p5-wrapper/react';
import p5 from 'p5';

export const getPointInitialPixelsColor = (
    p5: P5CanvasInstance,
    canvasHeight: number,
    canvasWidth: number,
) => {
    // const pointColor = p5.color(
    //     p5.random(0, 255),
    //     p5.random(0, 255),
    //     p5.random(0, 255),
    // );
    const pointColor = p5.color(129, 149, 140);
    const restColor = p5.color(255, 255, 255);
    const pointPosition = [
        p5.random(0, canvasHeight),
        p5.random(0, canvasWidth),
    ];
    const pointSize = p5.random(10, canvasHeight / 3);
    const pointTrailSize = p5.random(10, canvasHeight / 1.5);
    const out = Array.from(
        { length: canvasWidth },
        () => new Array<p5.Color>(canvasHeight),
    );
    for (let indexW = 0; indexW < canvasWidth; indexW++) {
        for (let indexH = 0; indexH < canvasHeight; indexH++) {
            const dx = indexW - pointPosition[0];
            const dy = indexH - pointPosition[1];
            const dist = Math.hypot(dx, dy);
            if (dist < pointSize) out[indexW][indexH] = pointColor;
            else if (dist < pointSize + pointTrailSize) {
                out[indexW][indexH] = p5.lerpColor(
                    pointColor,
                    restColor,
                    (dist - pointSize) / pointTrailSize,
                );
            } else {
                out[indexW][indexH] = restColor;
            }
        }
    }
    return out;
};
