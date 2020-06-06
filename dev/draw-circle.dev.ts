const { ccclass, property } = cc._decorator;
/**
 * This draw a circle over the node. If graphic component does not exists it will create.
 * 
 * @example
 * Add as script component, in the editor is possible to configure the stroke color  and width
 * 
 * @author mrosalesdiaz
 * @history 2020-05-26 mrosalesdiaz - Initial version
 */
@ccclass
export default class DrawCircle extends cc.Component {

    onLoad() {
        let g: cc.Graphics;
        if (!this.node.getComponent(cc.Graphics)) {
            g = this.node.addComponent(cc.Graphics);
            g.strokeColor = cc.Color.RED;
            g.lineWidth = 2;
        }

        g.clear();
        g.ellipse(0, 0, this.node.width / 2, this.node.height / 2);
        g.stroke();
    }

}
