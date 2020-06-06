const { ccclass, property } = cc._decorator;
/**
 * Simple class to activate collision debug.
 * @example
 * Add this script to a node, the values are active by default. It can be configured in the editor.
 * 
 * @author mrosalesdiaz
 * @history 2020-05-26 mrosalesdiaz - Initial version
 */
@ccclass
export default class EnableCollisionDebug extends cc.Component {
    @property(cc.Boolean)
    enableCollisionDebug: boolean = true;

    @property(cc.Boolean)
    enabledDrawBoundingBox: boolean = true;

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = this.enableCollisionDebug;
        cc.director.getCollisionManager().enabledDrawBoundingBox = this.enabledDrawBoundingBox;
    }
}
