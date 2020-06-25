import { VectorHelper } from "../steering/common";

export default class EventUtils {
    static screenClick(clickPos: cc.Vec2, relativeNode: cc.Node): cc.Vec2 {
        const cameraRelative = cc.Camera.findCamera(relativeNode).getScreenToWorldPoint(clickPos);
        const location = VectorHelper.toVec2(relativeNode.convertToNodeSpaceAR(cameraRelative));
        return location;
    }

    static screenTouch(touchPos: cc.Vec2, relativeNode: cc.Node): cc.Vec2 {
        const cameraRelative = cc.Camera.findCamera(relativeNode).getScreenToWorldPoint(touchPos);
        const location = VectorHelper.toVec2(relativeNode.convertToNodeSpaceAR(cameraRelative));
        return location;
    }
}
