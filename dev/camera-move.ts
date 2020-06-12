import ClampCounter from "../utils/clamp-counter";
import TwoStatesVar from "../utils/two-states-var";
import EventUtils from "../utils/events.utils";
import { VectorHelper } from "../steering/common";

const { ccclass, property } = cc._decorator;

/**
 * Script Component to move the camera. Whnc click takes the vector and adds to tha camera position. If right click it back to center.
 * 
 * @example
 * Add to the camera node and test by click left-click to move in that direction or right-click to back to center
 * 
 * @author mrosalesdiaz
 * @history 2020-06-11 mrosalesdiaz - Initial version
 * 
 */
@ccclass
export default class CameraMove extends cc.Component {

    private newPosition: TwoStatesVar<cc.Vec3> = new TwoStatesVar(cc.Vec3.ZERO);
    private alignCamera: ClampCounter = new ClampCounter();

    onLoad() {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseClicked, this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseClicked, this);
    }

    onMouseClicked(evt: cc.Event.EventMouse) {
        if (evt.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
            this.newPosition.current = cc.Vec3.ZERO;
        } else {
            this.newPosition.current = this.newPosition.current.add(VectorHelper.toVec3(EventUtils.screenClick(evt, this.node)));
        }
    }

    update(dt: number) {
        if (this.newPosition.justChanged) {
            this.alignCamera.reset();
        }
        this.node.setPosition(this.node.position.lerp(this.newPosition.current, this.alignCamera.update(dt).ratio));
    }

}
