import { P5CanvasInstance } from '@p5-wrapper/react';
import {
    Parameter,
    ParameterType,
    ParameterValues,
    randomSeedParameter,
} from '../../components/Parameter';
import { randomAround, randomInterval } from '../utils/mathFunctions';

const canvasWidth = 700;
const canvasHeight = 700;

export const parameters = [
    randomSeedParameter,
    {
        name: 'Amount',
        minValue: 1,
        maxValue: 10000,
        initialValue: 500,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Noise Speed',
        minValue: 0.001,
        maxValue: 0.5,
        initialValue: 0.03,
        step: 0.001,
        type: ParameterType.SLIDER,
    },
    // {
    //     name: 'Background Saturation',
    //     minValue: 0,
    //     maxValue: 100,
    //     initialValue: 30,
    //     step: 1,
    //     type: ParameterType.SLIDER,
    // },
] as const satisfies Parameter[];

class Branch {
    x: number;
    y: number;
    p5: P5CanvasInstance;
    prevx: number;
    prevy: number;
    color: ReturnType<P5CanvasInstance['color']>;
    speedx: number;
    speedy: number;
    visible: boolean;
    noiseSpeedFactor: number;
    initialAlpha: number;
    curAlpha: number;
    branchesAmount: number;

    constructor(
        p5: P5CanvasInstance,
        x: number,
        y: number,
        noiseSpeedFactor: number,
        branchesAmount: number,
    ) {
        this.x = x;
        this.y = y;
        this.prevx = x;
        this.prevy = y;
        this.p5 = p5;
        this.color = this.p5.color(
            randomInterval(100, 200),
            randomInterval(100, 200),
            randomInterval(100, 200),
        );
        this.noiseSpeedFactor = noiseSpeedFactor;
        this.speedx =
            this.p5.noise(
                this.y * this.noiseSpeedFactor,
                this.x * this.noiseSpeedFactor,
            ) - 0.5;
        this.speedy =
            this.p5.noise(
                this.y * this.noiseSpeedFactor,
                this.x * this.noiseSpeedFactor,
            ) - 1;
        this.visible = true;
        this.branchesAmount = branchesAmount;
        this.initialAlpha = randomInterval(80, 130) * 500 / this.branchesAmount;
        this.curAlpha = this.initialAlpha;
    }

    move() {
        // updates current position of the branch
        this.speedx +=
            this.p5.noise(
                this.x * this.noiseSpeedFactor,
                this.y * this.noiseSpeedFactor,
            ) - 0.5;
        this.speedy =
            this.speedy +
            this.p5.noise(
                this.y * this.noiseSpeedFactor,
                this.x * this.noiseSpeedFactor,
            ) - 0.7; // strong bias to constraint the lines to go upward
        const absSpeed = Math.sqrt(this.speedx * this.speedx + this.speedy * this.speedy);
        const wishedAbsSpeed = randomAround(2, 0.5);
        this.speedx *= wishedAbsSpeed / absSpeed;
        this.speedy *= wishedAbsSpeed / absSpeed;
        this.x += this.speedx;
        this.y += this.speedy;
        // if (randomInterval(0, 100) < 1) {
        //     console.log(this.speedx, this.speedy);
        // }
    }

    draw() {
        // draws a straight, semi-transparent line between former and current position of the branch
        if (this.visible) {
            this.curAlpha -= this.initialAlpha / 40;
            this.p5.stroke(255, 255, 255, this.curAlpha);
            const dx = this.x - this.prevx;
            const dy = this.y - this.prevy;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len > 0.5) {
                this.p5.line(
                    this.prevx,
                    this.prevy,
                    this.x - (dx / len) * 0.78,
                    this.y - (dy / len) * 0.78,
                );
            }
        }
    }

    update_visible() {
        // if the current position of the branch is outside the canvas' boundaries, do not draw it anymore
        this.prevx = this.x;
        this.prevy = this.y;
        if (
            this.x < 0 ||
            this.y < 0 ||
            this.x > canvasWidth ||
            this.y > canvasHeight ||
            this.curAlpha <= 1
        )
            this.visible = false;
    }
}

function create_branches(
    amount: number,
    noiseSpeedFactor: number,
    p5: P5CanvasInstance,
) {
    const all_branches = [];
    for (let i = 0; i < amount; i++) {
        const x = randomInterval(0.4 * canvasWidth, 0.6 * canvasWidth);
        const y = canvasHeight / 2;
        all_branches.push(new Branch(p5, x, y, noiseSpeedFactor, amount));
    }
    return all_branches;
}

export const setup = (
    p5: P5CanvasInstance,
    paramValues: ParameterValues<typeof parameters>,
) => {
    return () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        // put setup code here
        // p5.redraw();
        // p5.noLoop();
        p5.smooth();
        p5.background(0);
        const branches = create_branches(
            paramValues['Amount'],
            paramValues['Noise Speed'],
            p5,
        );
        for (let i = 0; i < 10000; i++) {
            branches.forEach((branch) => {
                branch.move();
                branch.draw();
                branch.update_visible();
            });
        }
    };
};
