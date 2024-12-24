export type Pixel = [number, number, number, number]
export type PixelMatrixObjectType = Pixel[][]

export class PixelMatrix {
    mat: PixelMatrixObjectType
    height: number
    width: number

    constructor(mat: Pixel[][]) {
        this.mat = mat
        this.height = this.mat.length
        this.width = this.mat[0].length
    }

    get = (h: number, w: number): Pixel => {
        const hint = Math.round(h),
            wint = Math.round(w)
        if (0 <= hint && hint < this.height) {
            if (0 <= wint && wint < this.width) {
                return this.mat[hint][wint]
            }
        }
        return [0, 0, 0, 0]
    }
}
