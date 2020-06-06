const { ccclass, property } = cc._decorator;
/**
 * Class to automatically destroy a node when its distance 
 * from the point 'fromPoint' is greather the value in 'distance'.
 * 
 * @example
 * Add as script component and set values for 'fromPoint' and 'distance'
 * 
 * @author mrosalesdiaz
 * @history 2020-05-26 mrosalesdiaz - Initial version
 */
@ccclass
export default class AutoDistanceDestroy extends cc.Component {
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
