const { ccclass, property } = cc._decorator;

export const DEV_EVENT_CLICKED = 'dev/clicked';

@ccclass
export default class ClickAreaDev extends cc.Component {
    onLoad() {
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onScreenClicked, this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.MOUSE_UP, this.onScreenClicked, this);
    }

    onScreenClicked(evt: cc.Event.EventMouse) {
        const clickMouse = evt.getLocation();
        const cameraRelative = cc.Camera.findCamera(this.node).getScreenToWorldPoint(clickMouse);
        const location = this.node.parent.convertToNodeSpaceAR(cameraRelative);
        const event = new cc.Event.EventCustom(DEV_EVENT_CLICKED, true);
        event.detail = { location };
        this.node.dispatchEvent(event);
    }
}
