import { VectorHelper } from "../steering/common";

export default class EventUtils {
    static screenClick(evt: cc.Event.EventMouse, relativeNode: cc.Node): cc.Vec2 {
        const clickMouse = evt.getLocation();
        const cameraRelative = cc.Camera.findCamera(relativeNode).getScreenToWorldPoint(clickMouse);
        const location = VectorHelper.toVec2(relativeNode.convertToNodeSpaceAR(cameraRelative));
        return location;
    }
}
}
