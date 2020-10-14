import MathHelper from "./math-helper.utils";

export default class VectorHelper {

    static map(actualVector: cc.Vec2, currentMaxLenght: number, newMaxLenght: number): cc.Vec2 {
        const newLenght = MathHelper.map(actualVector.len(), 0, currentMaxLenght, 0, newMaxLenght);
        return VectorHelper.limit(actualVector, newLenght);
    }

    static angle(target: cc.Vec2): number {
        return cc.Vec2.RIGHT.signAngle(target);
    }
    public static randomVec2(length: number = 1): cc.Vec2 {
        return new cc.Vec2(
            MathHelper.map(Math.random(), 0, 1, -1, 1)
            , MathHelper.map(Math.random(), 0, 1, -1, 1)
        ).normalize().multiplyScalar(length);
    }
    public static randomVec3(length: number = 1): cc.Vec3 {
        return new cc.Vec3(
            MathHelper.map(Math.random(), 0, 1, -1, 1)
            , MathHelper.map(Math.random(), 0, 1, -1, 1)
            , MathHelper.map(Math.random(), 0, 1, -1, 1)
        ).normalize().multiplyScalar(length);
    }

    public static vectoFromAngle(angle: number, length: number = 1): cc.Vec2 {
        return new cc.Vec2(length * Math.cos(angle), length * Math.sin(angle));
    }

    /**
     * Returns the vector angle in radians
     * @param vec2 
     */
    public static heading(vec2: cc.Vec2): number {
        return Math.atan2(vec2.y, vec2.x);
    }

    public static setLength(vec: cc.Vec2, mag: number): cc.Vec2 {
        return vec.normalize().mulSelf(mag);
    }

    public static limit(vec: cc.Vec2, max: number, errorFactor: number = 0): cc.Vec2 {
        if (vec.mag() + errorFactor > max) {
            return vec.normalize().multiplyScalar(max);
        }
        return vec;
    }

    public static toVec2(vec: cc.Vec3): cc.Vec2 {
        return new cc.Vec2(vec.x, vec.y);
    }

    public static toVec3(vec: cc.Vec2, z: number = 0): cc.Vec3 {
        return new cc.Vec3(vec.x, vec.y, z);
    }

}