import { P5CanvasInstance } from "@p5-wrapper/react";
import { Parameter, ParameterType, ParameterValues, randomSeedParameter } from "../../components/Parameter";

export const parameters = [
    randomSeedParameter,
    {
        name: 'Amount',
        minValue: 50,
        maxValue: 3000,
        initialValue: 1000,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Line Amplitude',
        minValue: 0,
        maxValue: 400,
        initialValue: 150,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Line Noise Scale',
        minValue: 0.001,
        maxValue: 0.05,
        initialValue: 0.006,
        step: 0.001,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Line Thickness',
        minValue: 2,
        maxValue: 100,
        initialValue: 70,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Ball Radius',
        minValue: 1,
        maxValue: 20,
        initialValue: 6,
        step: 1,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Attraction Strength',
        minValue: 0.01,
        maxValue: 5,
        initialValue: 0.6,
        step: 0.01,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Repulsion Strength',
        minValue: 0.01,
        maxValue: 5,
        initialValue: 1,
        step: 0.01,
        type: ParameterType.SLIDER,
    },
    {
        name: 'Simulation Steps',
        minValue: 10,
        maxValue: 1000,
        initialValue: 600,
        step: 1,
        type: ParameterType.SLIDER,
    },
] as const satisfies Parameter[];

const velocityDamping = 0;

type LinePoint = {
    x: number;
    y: number;
};

function createGuideLine(
    p5: P5CanvasInstance,
    canvasWidth: number,
    canvasHeight: number,
    amplitude: number,
    noiseScale: number,
): LinePoint[] {
    const points: LinePoint[] = [];
    const step = 4;
    for (let x = 0; x <= canvasWidth; x += step) {
        const y = canvasHeight / 2 + (p5.noise(x * noiseScale) - 0.5) * amplitude;
        points.push({ x, y });
    }
    return points;
}

class Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    p5: P5CanvasInstance;

    constructor(
        p5: P5CanvasInstance,
        x: number,
        y: number,
        radius: number,
    ) {
        this.p5 = p5;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = radius;
    }

    // Pulls the ball towards every point of the guide line at once (closer points
    // pulling harder), and keeps track of the closest point/distance found along the
    // way so the caller can enforce the line's thickness as a hard boundary.
    attractToLine(
        linePoints: LinePoint[],
        strength: number,
    ): { closestPoint: LinePoint; closestDistance: number } {
        let sumX = 0;
        let sumY = 0;
        let sumWeight = 0;
        let closestPoint = linePoints[0];
        let closestDistance = Infinity;

        for (const point of linePoints) {
            const dx = point.x - this.x;
            const dy = point.y - this.y;
            const distanceSquared = dx * dx + dy * dy + 1;
            const weight = 1 / distanceSquared;
            sumX += dx * weight;
            sumY += dy * weight;
            sumWeight += weight;

            const distance = Math.sqrt(distanceSquared);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPoint = point;
            }
        }

        const pullX = sumX / sumWeight;
        const pullY = sumY / sumWeight;
        const pullLength = Math.sqrt(pullX * pullX + pullY * pullY) || 1;
        this.vx += Math.min((pullX / pullLength) * strength, 5);
        this.vy += Math.min((pullY / pullLength) * strength, 5);

        return { closestPoint, closestDistance };
    }

    // Hard boundary: if the ball ended up inside the line's thickness, push it back
    // out so it stays flush against the line's edge instead of overlapping it.
    keepOutOfLine(closestPoint: LinePoint, closestDistance: number, lineThickness: number) {
        const minDistance = lineThickness / 2 + this.radius;
        if (closestDistance >= minDistance || closestDistance === 0) {
            return;
        }
        const dx = (this.x - closestPoint.x) / closestDistance;
        const dy = (this.y - closestPoint.y) / closestDistance;
        this.x = closestPoint.x + dx * minDistance;
        this.y = closestPoint.y + dy * minDistance;
    }

    // Separates two overlapping balls along the axis joining their centers. The
    // push grows towards infinity as the balls get closer together, so no amount of
    // attraction can force them to actually overlap - they just get shoved back apart
    // harder and harder the deeper they sink into each other.
    repelFrom(other: Ball, strength: number) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const minDistance = (this.radius + other.radius) * 1.05;
        if (distance >= minDistance) {
            return;
        }
        const push = strength * minDistance * (minDistance / distance - 1);
        const pushX = (dx / distance) * push * 0.5;
        const pushY = (dy / distance) * push * 0.5;
        this.x += pushX;
        this.y += pushY;
        other.x -= pushX;
        other.y -= pushY;
    }

    integrate() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= velocityDamping;
        this.vy *= velocityDamping;
    }

    draw(guideLine: LinePoint[], lineThickness: number, log=false) {
        let closestPoint = guideLine[0];
        let closestXDistance = Infinity;
        for (const point of guideLine) {
            const xDistance = Math.abs(point.x - this.x);
            if (xDistance < closestXDistance) {
                closestXDistance = xDistance;
                closestPoint = point;
            }
        }
        const dx = closestPoint.x - this.x;
        const dy = closestPoint.y - this.y;
        const distanceToLine = Math.sqrt(dx * dx + dy * dy);
        if (distanceToLine < lineThickness / 2) {
            return;
        }

        this.p5.fill(Math.random() * 100);
        let xoff, yoff;
        this.p5.beginShape();
        for(let i = 0; i < this.p5.TWO_PI; i += (this.p5.PI/10)) {
            xoff = this.p5.cos(i);
            yoff = this.p5.sin(i);
            const r = this.radius * this.p5.noise(this.x + xoff,this.y + yoff);
            if(log) {
                console.log(xoff, yoff, r)
            }
            const x = this.x + r * this.p5.sin(i);
            const y = this.y + r * this.p5.cos(i);
            this.p5.vertex(x,y);
        }  
        this.p5.endShape(this.p5.CLOSE);
    }
}

function createBalls(
    p5: P5CanvasInstance,
    amount: number,
    canvasWidth: number,
    canvasHeight: number,
    radius: number,
): Ball[] {
    const balls: Ball[] = [];
    for (let i = 0; i < amount; i++) {
        const x = p5.random(0, canvasWidth);
        const y = p5.random(0, canvasHeight);
        balls.push(new Ball(p5, x, y, radius));
    }
    return balls;
}

function simulate(
    balls: Ball[],
    linePoints: LinePoint[],
    lineThickness: number,
    attractionStrength: number,
    repulsionStrength: number,
    steps: number,
) {
    for (let step = 0; step < steps; step++) {
        for (const ball of balls) {
            const { closestPoint, closestDistance } = ball.attractToLine(linePoints, attractionStrength);
            ball.integrate();
            ball.keepOutOfLine(closestPoint, closestDistance, lineThickness);
        }

        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                balls[i].repelFrom(balls[j], repulsionStrength);
            }
        }
    }
}

export const setup = (
    p5: P5CanvasInstance,
    paramValues: ParameterValues<typeof parameters>,
) => {
    return () => {
        const size = 1536;
        p5.createCanvas(size, size);
        p5.smooth();
        // p5.fill(0);
        p5.noFill();
        p5.noStroke();
        p5.background(255, 230, 180);

        const linePoints = createGuideLine(
            p5,
            size,
            size,
            paramValues['Line Amplitude'],
            paramValues['Line Noise Scale'],
        );
        const balls = createBalls(
            p5,
            paramValues['Amount'],
            size,
            size,
            paramValues['Ball Radius'],
        );

        simulate(
            balls,
            linePoints,
            paramValues['Line Thickness'],
            paramValues['Attraction Strength'],
            paramValues['Repulsion Strength'],
            paramValues['Simulation Steps'],
        );

        balls.forEach((ball, i) => ball.draw(linePoints, paramValues['Line Thickness'], i==0));
    }
}