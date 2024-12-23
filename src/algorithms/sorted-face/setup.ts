import { P5CanvasInstance } from '@p5-wrapper/react'
import { Image } from 'p5'
import { Element2D } from '../utils/Element2D'
import { Pixel, PixelMatrix, PixelMatrixObjectType } from '../utils/PixelMatrix'
import {
    poweredClip,
    randInt,
    randomAround,
    randomExponentialAvg,
    randomInterval,
} from '../utils/mathFunctions'

import backgroundImage from './assets/face_2_687_1031.jpg'

let img: Image
const canvasWidth = 687
const canvasHeight = 1031

const directionVector = new Element2D(1, 0.28)
let oppositeDirectionVector = directionVector.opposite()
let backwardOverlapLengthAverage = 30
let forwardOverlapLengthAverage = 50
let maximumShadeMarginToBreakLine = 10 // randomness in condition to decide the end of a line
let minimumPixelShade = 24
let minimumLineShade = 24
let maximumLineShade = 255
let minimumLineLengthAverage = 10
let averageStrokeWeight = 1
let linesToSkipRatioAverage = 0.2
let clippingPower = 1.3 // the higher, the more contrasted, default=1
let lineBrightnessRandomAdjustmentMargin = 15
let lineAlpha = 45

const getImagePixels = () => {
    img.loadPixels()
    const flatPixels = img.pixels
    const imgPixels: PixelMatrixObjectType = new Array(canvasHeight)
    for (let i = 0; i < canvasHeight; i++) {
        imgPixels[i] = []
        for (let j = 0; j < canvasWidth; j++) {
            imgPixels[i].push(
                flatPixels.subarray(
                    i * 4 * canvasWidth + 4 * j,
                    i * 4 * canvasWidth + 4 * j + 4
                )
            )
        }
    }
    return imgPixels
}

export const preload = (p5: P5CanvasInstance) => {
    return () => {
        try {
            img = p5.loadImage(backgroundImage)
        } catch (err) {
            console.error(err)
            throw err
        }
    }
}

const startOrEndConditionColored = (
    shadeSum: number[],
    shadesAmount: number,
    currentPixelShade: Pixel,
    currentMinimumLineLength = 0
) => {
    // shadeSum and currentPixelShade are 3-uples (RGB colors from 0 to 255)
    const averageShade =
        (currentPixelShade[0] + currentPixelShade[1] + currentPixelShade[2]) / 3
    if (shadesAmount == 0)
        // no current line
        return averageShade > minimumPixelShade
    //&& Math.random() < 0.95  // condition to start a new line
    else {
        // return whether we do continue on the current line
        if (shadesAmount < currentMinimumLineLength) return true
        if (
            Math.abs(currentPixelShade[0] - shadeSum[0]) <
            shadeSum[0] / shadesAmount +
                randInt(0, maximumShadeMarginToBreakLine)
        ) {
            return true
        }
        if (
            Math.abs(currentPixelShade[1] - shadeSum[1]) <
            shadeSum[1] / shadesAmount +
                randInt(0, maximumShadeMarginToBreakLine)
        ) {
            return true
        }
        if (
            Math.abs(currentPixelShade[2] - shadeSum[2]) <
            shadeSum[2] / shadesAmount +
                randInt(0, maximumShadeMarginToBreakLine)
        ) {
            return true
        }
        return false
    }
}

const drawPure = (p5: P5CanvasInstance, matrixToFollow: PixelMatrix) => {
    for (
        let height = -Math.max(canvasHeight, canvasWidth);
        height < canvasHeight;
        height += randomAround(averageStrokeWeight, 0.8)
    ) {
        if (Math.random() < randomAround(linesToSkipRatioAverage, 0.5)) continue // skip a line from time to time

        let curx = 0
        let cury = height
        let start = null
        let end = null
        let shadeSum = [0, 0, 0],
            shadesAmount = 0
        let currentMinimumLineLength
        while (curx < canvasWidth && cury < canvasHeight) {
            if (
                cury < 2 * forwardOverlapLengthAverage ||
                curx < 2 * backwardOverlapLengthAverage
            ) {
                // avoid border effects at the top of the picture
                curx += directionVector.x
                cury += directionVector.y
                continue
            }
            // console.log(shadeSum)
            const currentPixelShade = matrixToFollow.get(cury, curx)
            if (
                startOrEndConditionColored(
                    shadeSum,
                    shadesAmount,
                    currentPixelShade,
                    currentMinimumLineLength
                )
            ) {
                if (start == null) {
                    currentMinimumLineLength = randomAround(
                        minimumLineLengthAverage
                    )
                    start = new Element2D(curx, cury)
                } else {
                    end = new Element2D(curx, cury)
                }
                shadeSum = shadeSum.map(
                    (currentShadeSum, index) =>
                        currentShadeSum + currentPixelShade[index]
                )
                shadesAmount += 1
            } else {
                if (end != null && start !== null) {
                    // draw a line between start and end and reset both values
                    const lineStart = start.translate(
                        oppositeDirectionVector,
                        randomExponentialAvg(backwardOverlapLengthAverage)
                    )
                    const lineEnd = end.translate(
                        directionVector,
                        randomExponentialAvg(forwardOverlapLengthAverage)
                    )
                    const heightRandomOffset = randomInterval(0.5, 0.5)
                    const lineColor = shadeSum.map(
                        (shade) => shade / shadesAmount
                    )
                    const randomBrightnessAdjustment = randInt(
                        -lineBrightnessRandomAdjustmentMargin,
                        lineBrightnessRandomAdjustmentMargin
                    )
                    p5.stroke(
                        p5.color([
                            ...lineColor.map((shade) =>
                                poweredClip(
                                    shade + randomBrightnessAdjustment,
                                    minimumLineShade,
                                    maximumLineShade,
                                    clippingPower
                                )
                            ),
                            lineAlpha,
                        ])
                    )
                    p5.strokeWeight(randomAround(averageStrokeWeight, 0.8))
                    p5.line(
                        lineStart.x,
                        lineStart.y + heightRandomOffset,
                        lineEnd.x,
                        lineEnd.y + heightRandomOffset
                    )

                    // reset everything
                    start = null
                    end = null
                    shadeSum = [0, 0, 0]
                    shadesAmount = 0
                }
            }
            curx += directionVector.x
            cury += directionVector.y
        }
    }
}

export const setup = (p5: P5CanvasInstance) => {
    return () => {
        console.log('setup')
        p5.createCanvas(canvasWidth, canvasHeight)
        p5.image(img, 0, 0, canvasWidth, canvasHeight)
        // put setup code here
        p5.redraw()
        p5.noLoop()
        p5.noSmooth()
        p5.smooth()

        // const blackenedPixels = blacken();
        // getImagePixels()

        p5.background(0)
        p5.blendMode(p5.BLEND)

        const matrixToFollow = getImagePixels()
        let pass = 1
        while (pass <= 2) {
            if (pass === 1) {
                oppositeDirectionVector = directionVector.opposite()
                backwardOverlapLengthAverage = 30
                forwardOverlapLengthAverage = 50
                maximumShadeMarginToBreakLine = 10 // randomness in condition to decide the end of a line
                minimumPixelShade = 24
                minimumLineShade = 12
                maximumLineShade = 255
                minimumLineLengthAverage = 10
                averageStrokeWeight = 2
                linesToSkipRatioAverage = 0.2
                clippingPower = 1.3 // the higher, the more contrasted, default=1
                lineBrightnessRandomAdjustmentMargin = 15
                lineAlpha = 45
                p5.blendMode(p5.REPLACE)
            }
            if (pass === 2) {
                oppositeDirectionVector = directionVector.opposite()
                backwardOverlapLengthAverage = 25
                forwardOverlapLengthAverage = 60
                maximumShadeMarginToBreakLine = 10 // randomness in condition to decide the end of a line
                minimumLineLengthAverage = 10
                // averageStrokeWeight = 1;
                minimumPixelShade = 24
                minimumLineShade = 10
                maximumLineShade = 255
                linesToSkipRatioAverage = 0.25
                clippingPower = 0.7 // the higher, the more contrasted, default=1
                lineBrightnessRandomAdjustmentMargin = 15
                lineAlpha = 23
                p5.blendMode(p5.ADD)
            }
            drawPure(p5, new PixelMatrix(matrixToFollow))
            pass++
        }

        console.log('setup finished')
    }
}
