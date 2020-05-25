
export default class CCUtil {
    public static toVec3(value: cc.Vec2): cc.Vec3 {
        return new cc.Vec3(value.x, value.y, 0);
    }
    public static toVec2(value: cc.Vec3): cc.Vec2 {
        return new cc.Vec2(value.x, value.y);
    }
    constructor() { }

    public static setMagnitudVec2(outVector: cc.Vec2, newMagnitude: number): cc.Vec2 {
        outVector.mulSelf(newMagnitude / outVector.mag());
        return outVector;
    }

    public static setMagnitudVec3(outVector: cc.Vec3, newMagnitude: number): cc.Vec3 {
        outVector.mulSelf(newMagnitude / outVector.mag());
        return outVector;
    }

    public static clampMagnitudVec3(outVector: cc.Vec3, min: number, max: number): cc.Vec3 {
        const expectedMagnitud = cc.misc.clampf(outVector.mag(), min, max);
        return CCUtil.setMagnitudVec3(outVector, expectedMagnitud);
    }

    public static clampMagnitudVec2(outVector: cc.Vec2, min: number, max: number): cc.Vec2 {
        const expectedMagnitud = cc.misc.clampf(outVector.mag(), min, max);
        return CCUtil.setMagnitudVec2(outVector, expectedMagnitud);
    }
}
