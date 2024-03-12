export class constUtils {

    static resolvePoint(x: number, y: number, width: number) : number {
        return (y * width) + x;
    }

    static getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }
  }
