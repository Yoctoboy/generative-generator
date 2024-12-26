import { CameraControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { randInt } from 'three/src/math/MathUtils.js'
import { Parameter, ParameterValues } from '../../components/Parameter'
import { SketchType } from '../Sketch'
import { Island, IslandProps } from './Island'
import { MAXX, MAXY, MAXZ, minDistanceBetweenIslands } from './constants'

const parameters: Parameter[] = [
    {
        name: 'Island Amount',
        minValue: 4,
        maxValue: 20,
        step: 1,
        initialValue: 5,
    },
]

export const Sketch = ({
    paramValues,
}: {
    paramValues: ParameterValues<typeof parameters>
}) => {
    const cameraControlRef = useRef<CameraControls | null>(null)

    const distance = (a: IslandProps, b: IslandProps) => {
        return Math.sqrt(
            Math.pow(a.centerx - b.centerx, 2) +
                Math.pow(a.centerz - b.centerz, 2)
        )
    }

    let isOk = false
    let islandsCoords
    do {
        const islandsAmount = paramValues['Island Amount']
        islandsCoords = [...Array(islandsAmount)].map(() => {
            return {
                centerx: randInt(0, MAXX),
                centerz: randInt(0, MAXZ),
                posy: randInt(0, MAXY),
                size: 10,
            }
        })
        console.log(islandsCoords)
        isOk = true
        for (let i = 0; i < islandsCoords.length && isOk; i++) {
            for (let j = i + 1; j < islandsCoords.length && isOk; j++) {
                if (
                    distance(islandsCoords[i], islandsCoords[j]) <
                    minDistanceBetweenIslands
                ) {
                    isOk = false
                }
            }
        }
    } while (!isOk)

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        10000
    )
    camera.position.set(1300, 300, 1300)
    camera.lookAt(0, -500, 0)

    return (
        <Canvas camera={camera}>
            <CameraControls ref={cameraControlRef} />
            <ambientLight intensity={Math.PI / 2} />
            <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                decay={0}
                intensity={Math.PI}
            />
            <pointLight
                position={[-10, -10, -10]}
                decay={0}
                intensity={Math.PI}
            />
            {islandsCoords.map((coords, index) => (
                <Island key={index} {...coords} size={10} />
            ))}
        </Canvas>
    )
}

const SquareCloudsSketch: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: 'Square Clouds',
}
export default SquareCloudsSketch
