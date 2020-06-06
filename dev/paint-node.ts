const { ccclass, property } = cc._decorator;
/**
 * Paint the node with the color configured in the graphic component
 * 
 * @example
 * Add as script component, in the editor is possible to configure the background color
 * 
 * @author mrosalesdiaz
 * @history 2020-06-02 mrosalesdiaz - Initial version
 */
@ccclass
export default class PaintNode extends cc.Component {

    onLoad() {
        let g: cc.Graphics;
        if (!this.node.getComponent(cc.Graphics)) {
            g = this.node.addComponent(cc.Graphics);
            g.fillColor = new cc.Color(
                this.node.color.r,
                this.node.color.g,
                this.node.color.b,
                this.node.opacity
            );
        }
        g = this.node.getComponent(cc.Graphics);

        g.clear();
        g.fillRect(-this.node.width / 2, -this.node.height / 2, this.node.width, this.node.height);
    }

}
