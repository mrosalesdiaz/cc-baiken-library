
interface LinearFunction {
    A: number;
    B: number;
    C: number;
}

interface RectVertex {
    A: cc.Vec2;
    B: cc.Vec2;
    C: cc.Vec2;
    D: cc.Vec2;
}

export default class FunctionHelper {
    static boxColliderToVertex(center: cc.Vec2, size: cc.Vec2): RectVertex {
        const half_w = size.x / 2;
        const half_h = size.y / 2;
        const A = new cc.Vec2(center.x - half_w, center.y + half_h);
        const B = new cc.Vec2(center.x + half_w, center.y + half_h);
        const C = new cc.Vec2(center.x + half_w, center.y - half_h);
        const D = new cc.Vec2(center.x - half_w, center.y - half_h);
        return { A, B, C, D };
    }

    static intersectionLines(p: cc.Vec2, r: cc.Vec2, q: cc.Vec2, s: cc.Vec2) {
        //   const t = (q.sub(p)) * s / (r * s);
        // const u = (q.sub(p)) * r / (r * s);

        return FunctionHelper.intersectionLines2(p.x, p.y, r.x, r.y, q.x, q.y, s.x, s.y);
    }
    // Returns 1 if the lines intersect, otherwise 0. In addition, if the lines 
    // intersect the intersection point may be stored in the floats i_x and i_y.
    static intersectionLines2(p0_x, p0_y, p1_x, p1_y,
        p2_x, p2_y, p3_x, p3_y) {
        let __i_x;
        let __i_y;
        let s1_x, s1_y, s2_x, s2_y;
        s1_x = p1_x - p0_x; s1_y = p1_y - p0_y;
        s2_x = p3_x - p2_x; s2_y = p3_y - p2_y;

        let s, t;
        s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
            __i_x = p0_x + (t * s1_x);
            __i_y = p0_y + (t * s1_y);
            return new cc.Vec2(__i_x, __i_y);
        }

        return null
    }
    static pointIsInSegment(p: cc.Vec2, A: cc.Vec2, B: cc.Vec2) {
        const Kac = B.sub(A).dot(p.sub(A));
        const Kab = B.sub(A).dot(B.sub(A));
        return (0 < Kac && Kac < Kab);
    }
    static getLinearFunctionConstants(start: cc.Vec2, end: cc.Vec2): LinearFunction {
        const A = start.y - end.y;
        const B = end.x - start.x;
        const C = -A * start.x - B * start.y;
        return { A, B, C };
    }
}
