const { ccclass, property } = cc._decorator;

@ccclass
export default class FollowMouse extends cc.Component {
    @property(cc.Prefab)
    instance: cc.Prefab = null;

    onLoad() {
        this.node.parent.on(cc.Node.EventType.MOUSE_MOVE, this.onMove, this);
        this.node.parent.on(cc.Node.EventType.MOUSE_DOWN, this.onClick, this);
    }
    onDestroy() {
        this.node.parent.off(cc.Node.EventType.MOUSE_MOVE, this.onMove, this);
        this.node.parent.off(cc.Node.EventType.MOUSE_DOWN, this.onClick, this);
    }
    onClick(evt: cc.Event.EventMouse) {
        if (this.instance) {
            const newNode = cc.instantiate(this.instance);
            newNode.position = this.node.parent.convertToNodeSpaceAR(cc.Camera.findCamera(this.node).getScreenToWorldPoint(evt.getLocation()));
            newNode.parent = this.node.parent;
        }
    }
    onMove(evt: cc.Event.EventMouse) {
        this.node.position = this.node.parent.convertToNodeSpaceAR(cc.Camera.findCamera(this.node).getScreenToWorldPoint(evt.getLocation()));
    }
}
