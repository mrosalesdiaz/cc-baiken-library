const { ccclass, executeInEditMode, property } = cc._decorator;
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
@executeInEditMode()
export default class DrawCircle extends cc.Component {
    @property(cc.Boolean)
    paintOnlyInEditor: boolean = true;

    onLoad() {
        if (!CC_EDITOR && this.paintOnlyInEditor) { return; }

        let g: cc.Graphics;
        if (!this.node.getComponent(cc.Graphics)) {
            g = this.node.addComponent(cc.Graphics);
            g.strokeColor = cc.Color.RED;
            g.lineWidth = 2;
        }
        g = this.node.getComponent(cc.Graphics);

        g.clear();
        g.ellipse(0, 0, this.node.width / 2, this.node.height / 2);
        g.stroke();
    }

}
