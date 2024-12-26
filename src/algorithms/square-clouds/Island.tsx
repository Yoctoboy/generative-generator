import { gaussianFunction, randomAround } from '../utils/mathFunctions'
import { DownRectangle, DownRectangleProps } from './DownRectangle'
import {
    maxAvgHeightDown,
    maxAvgHeightUp,
    minRectangleHeight,
    rectangleWidth,
} from './constants'

export type IslandProps = {
    posy: number
    centerx: number
    centerz: number
    size: number
}

export const Island = ({ posy, centerx, centerz, size }: IslandProps) => {
    const normalizedDistanceFromCenter = (x: number, z: number) => {
        return (
            Math.pow(Math.pow(x - centerx, 2) + Math.pow(z - centerz, 2), 0.5) /
            rectangleWidth
        )
    }

    const sigma = size / 3.5

    const maxGaussianHeight = gaussianFunction(0, size, 0)
    const gridSize = size
    const rectanglesProps: DownRectangleProps[] = []
    for (
        let x = centerx - gridSize * rectangleWidth;
        x < centerx + gridSize * rectangleWidth;
        x += rectangleWidth
    ) {
        for (
            let z = centerz - gridSize * rectangleWidth;
            z < centerz + gridSize * rectangleWidth;
            z += rectangleWidth
        ) {
            const heightUp = randomAround(
                (gaussianFunction(
                    0,
                    sigma,
                    normalizedDistanceFromCenter(x, z)
                ) /
                    maxGaussianHeight) *
                    maxAvgHeightUp,
                0.7
            )
            const heightDown = randomAround(
                (gaussianFunction(
                    0,
                    sigma,
                    normalizedDistanceFromCenter(x, z)
                ) /
                    maxGaussianHeight) *
                    maxAvgHeightDown,
                0.7
            )
            if (heightDown + heightUp > minRectangleHeight) {
                rectanglesProps.push({
                    height: heightDown + heightUp,
                    posx: x,
                    posy: posy + heightUp,
                    posz: z,
                })
            }
        }
    }

    return (
        <>
            {rectanglesProps.map((props, index) => (
                <DownRectangle key={index} {...props} />
            ))}
        </>
    )
}
