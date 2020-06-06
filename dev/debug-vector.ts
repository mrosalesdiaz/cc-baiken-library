
const { ccclass, property } = cc._decorator;

@ccclass
export default class DebugVector extends cc.Component {

    @property(cc.Node)
    nodeToListen: cc.Node = null;

    @property(cc.String)
    eventToListen: string;

    vector: cc.Vec2 = null;

    onLoad() {
        if (this.eventToListen && this.nodeToListen) {
            this.nodeToListen.on(this.eventToListen, this.updateVector, this);
        }

        let g: cc.Graphics;
        if (!this.node.getComponent(cc.Graphics)) {
            g = this.node.addComponent(cc.Graphics);
            g.strokeColor = new cc.Color(
                this.node.color.r,
                this.node.color.g,
                this.node.color.b,
                this.node.opacity
            );
            g.lineWidth = 2;
        }
    }

    onDestroy() {
        if (this.eventToListen && this.nodeToListen) {
            this.nodeToListen.off(this.eventToListen, this.updateVector, this);
        }
    }

    updateVector(evt: cc.Event.EventCustom) {
        this.vector = evt.detail;
    }

    update(dt: number) {
        if (this.vector == null) { return; }

        const g: cc.Graphics = this.node.getComponent(cc.Graphics);
        g.clear();
        g.moveTo(0, 0);
        g.lineTo(this.vector.x, this.vector.y);
        g.circle(this.vector.x, this.vector.y, 2);
        g.stroke();
    }

}
