import { VectorHelper } from "../steering/common";
import FunctionHelper from "./function-helper";

export default class ColliderManagerEx {
    private colliderManager: cc.CollisionManager;

    constructor() {
        this.colliderManager = cc.director.getCollisionManager();
    }

    rayCast(start: cc.Vec2, end: cc.Vec2): [] {
        const collisions = this.colliderManager['_colliders']
            .map(c => {
                if (c instanceof cc.BoxCollider) {
                    const instance: cc.BoxCollider = c;
                    return this.testWithBox(instance, start, end);
                } else if (c instanceof cc.CircleCollider) {
                    const instance: cc.CircleCollider = c;
                    return this.testIntersection(instance, start, end);
                } else if (c instanceof cc.PolygonCollider) {
                    const instance: cc.PolygonCollider = c;
                    return this.testIntersectionPoligon(instance, start, end);
                } else {
                    throw `Type is not supported: ${c}`
                }
            })
            .filter(c => c != null);

        return collisions;

    }
    testIntersectionPoligon(instance: cc.PolygonCollider, start: cc.Vec2, end: cc.Vec2) {
        const intersect = instance.points
            .map(p => p.add(VectorHelper.toVec2(instance.node.position).add(instance.offset)))
            .reduce((prev, curr, index, all) => {
                let nextIndex = index + 1;
                if (nextIndex == all.length) {
                    nextIndex = 0;
                }
                prev.push(FunctionHelper.intersectionLines(curr, all[nextIndex], start, end))
                return prev;
            }, []).filter(p => p != null);
        return intersect
    }
    testWithBox(instance: cc.BoxCollider, start: cc.Vec2, end: cc.Vec2) {
        const p = VectorHelper.toVec2(instance.node.position).add(instance.offset);
        const { A, B, C, D } = FunctionHelper.boxColliderToVertex(p, new cc.Vec2(instance.size.width, instance.size.height));

        return [
            FunctionHelper.intersectionLines(A, B, start, end),
            FunctionHelper.intersectionLines(B, C, start, end),
            FunctionHelper.intersectionLines(C, D, start, end),
            FunctionHelper.intersectionLines(D, A, start, end)
        ].filter(p => p != null)
    }

    testIntersection(instance: cc.CircleCollider, start: cc.Vec2, end: cc.Vec2): cc.Vec2[] {
        const translate: cc.Vec2 = VectorHelper.toVec2(instance.node.position).add(instance.offset);
        const r: number = instance.radius;
        const center = new cc.Vec2(0, 0);
        start = start.sub(translate);
        end = end.sub(translate);

        const { A, B, C } = FunctionHelper.getLinearFunctionConstants(start, end);
        const d = Math.abs(A * center.x + B * center.y + C) / Math.sqrt(A * A + B * B)
        const intersectX = -(A * C) / (A * A + B * B);
        const intersectY = -(B * C) / (A * A + B * B);

        const intersect = (d <= r);
        if (intersect) {
            const dd = Math.sqrt(r * r - (C * C / (A * A + B * B)));
            const mm = Math.sqrt(dd * dd / (A * A + B * B));

            const a = new cc.Vec2(intersectX + B * mm, intersectY - A * mm);
            const b = new cc.Vec2(intersectX - B * mm, intersectY + A * mm)
            const returnValue = [];


            if (FunctionHelper.pointIsInSegment(a, start, end)) {
                returnValue.push(a.add(translate));
            }
            if (FunctionHelper.pointIsInSegment(b, start, end)) {
                returnValue.push(b.add(translate));
            }

            return returnValue;
        }

        return [];
    }

    intersectCircleLine2(center: cc.Vec2, r: number, start: cc.Vec2, end: cc.Vec2) {
        const P = start.sub(center);
        const Q = end.sub(center)
        const a = P.y - Q.y;
        const b = Q.x - P.y;
        const c = -a * P.x - b * P.y;

        //double r, a, b, c; // given as input
        const x0 = -a * c / (a * a + b * b), y0 = -b * c / (a * a + b * b);
        if (c * c > r * r * (a * a + b * b) + Number.EPSILON) {
            cc.log("no points");
            return false;
        } else if (Math.abs(c * c - r * r * (a * a + b * b)) < Number.EPSILON) {
            cc.log("1 point");
            cc.log('x: ', x0, ' y: ', y0);
            return true;
        } else {
            const d = r * r - c * c / (a * a + b * b);
            const mult = Math.sqrt(d / (a * a + b * b));
            let ax, ay, bx, by;
            ax = x0 + b * mult;
            bx = x0 - b * mult;
            ay = y0 - a * mult;
            by = y0 + a * mult;
            cc.log("2 points");
            cc.log('ax: ', ax, ' ay: ', ay, ' bx: ', bx, ' by: ', by);
            return true;
        }
    }

    intersectCircleLine(center: cc.Vec2, r: number, start: cc.Vec2, end: cc.Vec2) {
        const d = end.sub(start);
        const f = start.sub(center);
        const a = d.dot(d);
        const b = 2 * f.dot(d);
        const c = f.dot(f) - r * r;

        let discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
            // no intersection
        }
        else {
            // ray didn't totally miss sphere,
            // so there is a solution to
            // the equation.

            discriminant = Math.sqrt(discriminant);

            // either solution may be on or off the ray so need to test both
            // t1 is always the smaller value, because BOTH discriminant and
            // a are nonnegative.
            const t1 = (-b - discriminant) / (2 * a);
            const t2 = (-b + discriminant) / (2 * a);

            // 3x HIT cases:
            //          -o->             --|-->  |            |  --|->
            // Impale(t1 hit,t2 hit), Poke(t1 hit,t2>1), ExitWound(t1<0, t2 hit), 

            // 3x MISS cases:
            //       ->  o                     o ->              | -> |
            // FallShort (t1>1,t2>1), Past (t1<0,t2<0), CompletelyInside(t1<0, t2>1)

            if (t1 >= 0 && t1 <= 1) {
                // t1 is the intersection, and it's closer than t2
                // (since t1 uses -b - discriminant)
                // Impale, Poke
                const pointX = new cc.Vec2(t1, (a * t1 + c) / -b)
                cc.log(pointX.x, pointX.y)
                return true;
            }

            // here t1 didn't intersect so we are either started
            // inside the sphere or completely past it
            if (t2 >= 0 && t2 <= 1) {
                // ExitWound
                const pointX = new cc.Vec2(t1, (a * t1 + c) / -b)
                cc.log(pointX.x, pointX.y)
                const pointY = new cc.Vec2(t2, (a * t2 + c) / -b)
                cc.log(pointY.x, pointY.y)
                return true;
            }

            // no intn: FallShort, Past, CompletelyInside
            return false;
        }
    }
}
