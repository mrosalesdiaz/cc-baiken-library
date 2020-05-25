const { ccclass, property } = cc._decorator;

@ccclass
export default class DrawCircle extends cc.Component {
    onLoad() {
        const g = this.node.getComponent(cc.Graphics);

        if (g) {
            g.clear();
            g.ellipse(0, 0, this.node.width / 2, this.node.height / 2);
            g.stroke();
        }
    }
}
