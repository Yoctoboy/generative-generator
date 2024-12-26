import * as THREE from 'three'

export type DownRectangleProps = {
    height: number
    posx: number
    posy: number
    posz: number
}

export const DownRectangle = ({
    height,
    posx,
    posy,
    posz,
}: DownRectangleProps) => {
    return (
        <>
            <mesh position={[posx, posy - height / 2, posz]}>
                <boxGeometry args={[10, height, 10]} />
                <meshStandardMaterial />
            </mesh>
            <lineSegments position={[posx, posy - height / 2, posz]}>
                <edgesGeometry
                    attach="geometry"
                    args={[new THREE.BoxGeometry(10, height, 10)]}
                />
                <lineBasicMaterial attach="material" color={0x000000} />
            </lineSegments>
        </>
    )
}
