const { ccclass, property } = cc._decorator;

export const DEV_EVENT_CLICKED = 'dev/clicked';

/**
 * Script component to emit click event with the information of the clicked point.
 * @example 
 * Add this script as component to a node and set the width and height to the node. It will emit a custom event to the hierarchy. 
 * 
 * this.node.on(DEV_EVENT_CLICKED,evt=>this.onClicked(evt))
 * 
 * onClicked(evt:cc.EventCustom):void{
 *  const location=evt.detail.location;
 * }
 * 
 * @author mrosalesdiaz
 * @history 2020-05-26 mrosalesdiaz - Init version
 * 
 */
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
