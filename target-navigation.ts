import CCUtil from "./cc.extensions";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Sprite)
    spriteTarget: cc.Sprite;


    @property(cc.Node)
    player: cc.Node;

    touching: boolean;

    onLoad() {
        //this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }
    onMouseDown(evt: cc.Event.EventMouse) {
        cc.log('----------------------')

        cc.log('getLocation()', evt.getLocation().x.toFixed(2), evt.getLocation().y.toFixed(2))
        const clickedPosition = this.node.convertToWorldSpaceAR(evt.getLocation());
        cc.log('clickedPosition', clickedPosition.x.toFixed(2), clickedPosition.y.toFixed(2))

        const arrowPosition = CCUtil.toVec2(this.node.convertToWorldSpaceAR(this.spriteTarget.node.position));
        cc.log('arrowPosition', arrowPosition.x.toFixed(2), arrowPosition.y.toFixed(2))

        const diff = clickedPosition.subtract(arrowPosition);
        cc.log('diff', diff.x.toFixed(2), diff.y.toFixed(2))

        const angle = cc.misc.radiansToDegrees(cc.Vec2.RIGHT.signAngle(diff));
        cc.log('angle', angle.toFixed(2))
        this.spriteTarget.node.angle = angle;
    }
    onMouseUp() {
    }
    onMouseMove(evt: cc.Event.EventMouse) {

    }

    onDisable() {
        this.node.off(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }
}
