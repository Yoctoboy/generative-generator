import { P5CanvasInstance } from '@p5-wrapper/react'
import { Parameter, ParameterValues } from '../Parameter'

const getRandomFloat = (min: number, max: number) => {
    return Math.random() * (max - min) + min
}

export const parameters = [
    {
        name: 'Background Hue',
        minValue: 0,
        maxValue: 360,
        initialValue: 274,
        step: 1,
    },
] as const satisfies Parameter[]

export const setup = (
    p5: P5CanvasInstance,
    paramValues: ParameterValues<typeof parameters>
) => {
    return () => {
        p5.colorMode('hsb')
        // global params
        const size = 513 // must be 2**n + 1
        const randomDivision = 1.3
        const maxColor = 100

        p5.createCanvas(size, size)

        // initialize 2D altitude matrix
        const mat = new Array(size).fill(0).map(() => new Array(size).fill(0))

        // diamond-square
        let space = size - 1
        let halfspace,
            avg,
            s,
            n,
            col,
            minalt = 100000.0,
            maxalt = -100000.0,
            result
        let randomFactor = 10
        while (space > 1) {
            halfspace = space / 2
            // diamond step
            for (let x = halfspace; x < size; x += space) {
                for (let y = halfspace; y < size; y += space) {
                    avg =
                        (mat[x - halfspace][y - halfspace] +
                            mat[x - halfspace][y + halfspace] +
                            mat[x + halfspace][y - halfspace] +
                            mat[x + halfspace][y + halfspace]) /
                        4
                    result = avg + getRandomFloat(-randomFactor, randomFactor)
                    mat[x][y] = result
                    minalt = Math.min(minalt, result)
                    maxalt = Math.max(maxalt, result)
                }
            }

            // square step
            let offset = 0
            for (let x = 0; x < size; x += halfspace) {
                if (offset == 0) offset = halfspace
                else offset = 0
                for (let y = offset; y < size; y += space) {
                    s = 0
                    n = 0
                    if (x >= halfspace) {
                        s += mat[x - halfspace][y]
                        n += 1
                    }
                    if (x + halfspace < size) {
                        s += mat[x + halfspace][y]
                        n += 1
                    }
                    if (y >= halfspace) {
                        s += mat[x][y - halfspace]
                        n += 1
                    }
                    if (y + halfspace < size) {
                        s += mat[x][y + halfspace]
                        n += 1
                    }
                    avg = s / n
                    result = avg + getRandomFloat(-randomFactor, randomFactor)
                    mat[x][y] = result
                    minalt = Math.min(minalt, result)
                    maxalt = Math.max(maxalt, result)
                }
            }
            randomFactor /= randomDivision
            space = halfspace
        }

        // rescale altitudes between 0 and maxcolor and set pixels accordingly
        for (let x = 0; x < size; x += 1) {
            for (let y = 0; y < size; y += 1) {
                mat[x][y] =
                    ((mat[x][y] - minalt) / (maxalt - minalt)) * maxColor
                col = p5.color(
                    paramValues['Background Hue'],
                    Math.floor(mat[x][y]),
                    Math.floor(mat[x][y])
                )
                p5.set(x, y, col)
            }
        }
        p5.updatePixels()
    }
}
