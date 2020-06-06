
export default class MathHelper {
    static TAU: number = Math.PI * 2;
    public static deltaAngle(target: number, source: number) {
        return Math.atan2(Math.sin(target - source), Math.cos(target - source))
    }

    static mapLoop(val: number, min: number, max: number, withinBounds: boolean = false): number {
        const value = MathHelper.map(val, min, max, 0, 2 * Math.PI, withinBounds);
        return MathHelper.map(Math.sin(value), -1, 1, min, max, withinBounds);
    }

    public static binomialRandom() {
        return Math.random() - Math.random();
    }

    public static wrapRadian(val: number): number {
        return Math.atan2(Math.sin(val), Math.cos(val));
    }

    public static map(n: number, start1: number, stop1: number, start2: number, stop2: number, withinBounds: boolean = false): number {
        //p5._validateParameters('map', arguments);
        const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        if (!withinBounds) {
            return newval;
        }
        if (start2 < stop2) {
            return cc.misc.clampf(newval, start2, stop2);
        } else {
            return cc.misc.clampf(newval, stop2, start2);
        }
    }



}