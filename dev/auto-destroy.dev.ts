const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoDestroy extends cc.Component {
    @property(cc.Vec3)
    fromPoint: cc.Vec3 = cc.Vec3.ZERO;

    @property(cc.Integer)
    distance: number = 100;

    lateUpdate() {
        if (cc.isValid(this.node) && this.fromPoint.sub(this.node.position).mag() > this.distance) {
            this.node.destroy();
        }
    }
}
