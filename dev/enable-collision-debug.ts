const { ccclass, property } = cc._decorator;
/**
 * Component to enable collision debug in the game. Add this commponent to any node in the game.
 */
@ccclass
export default class EnableCollisionDebug extends cc.Component {
    @property(cc.Boolean)
    enableCollisionDebug: boolean = false;

    @property(cc.Boolean)
    enabledDrawBoundingBox: boolean = false;

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = this.enableCollisionDebug;
        cc.director.getCollisionManager().enabledDrawBoundingBox = this.enabledDrawBoundingBox;
    }
}
