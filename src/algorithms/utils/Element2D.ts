export class Element2D {
    x: number
    y: number
    length: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.length = Math.pow(x * x + y * y, 0.5)
    }

    normalize() {
        this.length = 1
        return new Element2D(this.x / this.length, this.y / this.length)
    }

    distance(point: Element2D) {
        return Math.pow(
            Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2),
            0.5
        )
    }

    translate(vector: Element2D, length = 1) {
        // vector is Element2D
        // translate a point or add a vector to an other vector
        vector = vector.normalize()
        return new Element2D(
            this.x + vector.x * length,
            this.y + vector.y * length
        )
    }

    opposite() {
        return new Element2D(-this.x, -this.y)
    }
}
