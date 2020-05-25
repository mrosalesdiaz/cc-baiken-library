import { VectorHelper } from "../steering/common";

export default class ColliderManagerEx {
    private colliderManager: cc.CollisionManager;

    constructor() {
        this.colliderManager = cc.director.getCollisionManager();
    }

    rayCast(start: cc.Vec2, end: cc.Vec2) {
        console.time('ray-cast')
        const collisions = this.colliderManager['_colliders']
            .map(c => {
                if (c instanceof cc.BoxCollider) {
                    return null;
                } else if (c instanceof cc.CircleCollider) {
                    const instance: cc.CircleCollider = c;
                    return this.intersectCircleLine(VectorHelper.toVec2(instance.node.position), instance.radius, start, end);
                } else if (c instanceof cc.PolygonCollider) {
                    return null;
                } else {
                    throw `Type is not supported: ${c}`
                }
            })
            .filter(c => c != null);
        console.timeEnd('ray-cast');

        return collisions;

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
