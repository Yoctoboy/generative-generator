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
        initialValue: 8500,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Noise Speed',
        minValue: 0.001,
        maxValue: 1,
        initialValue: 0.03,
        step: 0.001,
        type: ParameterType.SLIDER,
    }, 
    {
        name: 'Color chaos',
        minValue: 1,
        maxValue: 40,
        initialValue: 3,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Tendrils length',
        minValue: 1,
        maxValue: 200,
        initialValue: 15,
        step: 1,
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
    length: number;

    constructor(
        p5: P5CanvasInstance,
        x: number,
        y: number,
        noiseSpeedFactor: number,
        branchesAmount: number,
        colorChaos: number,
        length: number,
    ) {
        this.x = x;
        this.y = y;
        this.prevx = x;
        this.prevy = y;
        this.p5 = p5;
        this.color = this.p5.color(
            this.p5.noise(this.x * colorChaos / 2500, this.y) * 255,
            this.p5.noise(this.x * colorChaos / 2500 + 1000, this.y) * 120,
            this.p5.noise(this.x * colorChaos / 2500 + 2000, this.y) * 0,
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
            ) - 2;
        this.visible = true;
        this.branchesAmount = branchesAmount;
        this.initialAlpha = randomInterval(80, 130) * 2500 / this.branchesAmount;
        this.curAlpha = this.initialAlpha;
        this.length = length;
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
            ) - 0.5; // strong bias to constraint the lines to go straight-ish
        const absSpeed = Math.sqrt(this.speedx * this.speedx + this.speedy * this.speedy);
        const wishedAbsSpeed = randomAround(2, 0.5);
        this.speedx *= wishedAbsSpeed / absSpeed;
        this.speedy *= wishedAbsSpeed / absSpeed;
        this.x += this.speedx;
        this.y += this.speedy;
    }

    draw() {
        // draws a straight, semi-transparent line between former and current position of the branch
        if (this.visible) {
            this.curAlpha -= this.initialAlpha / this.length;
            this.color.setAlpha(this.curAlpha)
            this.p5.stroke(this.color);
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
    colorChaos: number,
    length: number,
    p5: P5CanvasInstance,
) {
    const all_branches = [];
    for (let i = 0; i < amount; i++) {
        const x = randomInterval(0 * canvasWidth, 1 * canvasWidth);
        const y = canvasHeight / 2;
        all_branches.push(new Branch(p5, x, y, noiseSpeedFactor, amount, colorChaos, length));
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
            paramValues["Color chaos"],
            paramValues["Tendrils length"],
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
