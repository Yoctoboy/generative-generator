import * as THREE from 'three'
import { gaussianFunction, randomAround } from '../utils/mathFunctions'
import {
    maxAvgHeightDown,
    maxAvgHeightUp,
    minRectangleHeight,
    rectangleWidth,
} from './constants'

class Island {
    posy: number
    centerx: number
    centerz: number
    size: number

    constructor({ scene, centerx, posy, centerz, size }) {
        this.scene = scene
        this.centerx = centerx
        this.posy = posy
        this.centerz = centerz
        this.size = size
    }

    normalizedDistanceFromCenter(x, z) {
        return (
            Math.pow(
                Math.pow(x - this.centerx, 2) + Math.pow(z - this.centerz, 2),
                0.5
            ) / rectangleWidth
        )
    }

    distanceFromCenter(x, z) {
        return Math.pow(
            Math.pow(x - this.centerx, 2) + Math.pow(z - this.centerz, 2),
            0.5
        )
    }

    createDownRectangle(
        height: number,
        posx: number,
        posy: number,
        posz: number
    ) {
        const geometry = new THREE.BoxGeometry(10, height, 10)
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 })
        const edges = new THREE.EdgesGeometry(geometry)
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

        const cube = new THREE.Mesh(geometry, cubeMaterial)
        cube.position.set(posx, posy - height / 2, posz)
        const line = new THREE.LineSegments(edges, edgeMaterial)
        line.position.set(posx, posy - height / 2, posz)

        this.scene.add(line)
        this.scene.add(cube)
    }

    generate() {
        const sigma = this.size / 3.5

        const maxGaussianHeight = gaussianFunction(0, this.size, 0)
        const gridSize = this.size
        for (
            let x = this.centerx - gridSize * rectangleWidth;
            x < this.centerx + gridSize * rectangleWidth;
            x += rectangleWidth
        ) {
            for (
                let z = this.centerz - gridSize * rectangleWidth;
                z < this.centerz + gridSize * rectangleWidth;
                z += rectangleWidth
            ) {
                const heightUp = randomAround(
                    (gaussianFunction(
                        0,
                        sigma,
                        this.normalizedDistanceFromCenter(x, z)
                    ) /
                        maxGaussianHeight) *
                        maxAvgHeightUp,
                    0.7
                )
                const heightDown = randomAround(
                    (gaussianFunction(
                        0,
                        sigma,
                        this.normalizedDistanceFromCenter(x, z)
                    ) /
                        maxGaussianHeight) *
                        maxAvgHeightDown,
                    0.7
                )
                console.log(x, z, heightDown + heightUp, maxGaussianHeight)
                if (heightDown + heightUp > minRectangleHeight)
                    this.createDownRectangle(
                        heightDown + heightUp,
                        x,
                        this.posy + heightUp,
                        z
                    )
            }
        }
    }
}

export default Island
