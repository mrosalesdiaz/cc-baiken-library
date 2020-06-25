import { VectorHelper } from "../steering/common";
import EventUtils from "./events.utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ThumbstickControllerComponent extends cc.Component {

    @property(cc.Integer)
    radius: number = 64;

    private pressed: boolean = false;
    public direction: cc.Vec2 = cc.Vec2.ZERO;
    startTouche: cc.Vec2 = cc.Vec2.ZERO;
    endTouche: cc.Vec2 = cc.Vec2.ZERO;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    onDestroy() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    update() {
        let directionVector = this.endTouche.sub(this.startTouche);
        directionVector = VectorHelper.limit(directionVector, this.radius);

        this.direction = directionVector.div(this.radius);
        this.node.setPosition(directionVector)
    }

    onTouchCancel(evt: cc.Event.EventTouch) {
        this.pressed = false;
        this.startTouche = cc.Vec2.ZERO;
        this.endTouche = cc.Vec2.ZERO;
    }

    onTouchMove(evt: cc.Event.EventTouch) {
        if (this.pressed === false) { return }
        this.endTouche = EventUtils.screenTouch(evt.getTouches()[0].getLocation(), this.node.parent);
    }

    onTouchEnd(evt: cc.Event.EventTouch) {
        this.pressed = false;
        this.startTouche = cc.Vec2.ZERO;
        this.endTouche = cc.Vec2.ZERO;
    }

    onTouchStart(evt: cc.Event.EventTouch) {
        this.pressed = true;
        this.startTouche = EventUtils.screenTouch(evt.getTouches()[0].getLocation(), this.node.parent);
    }

}
