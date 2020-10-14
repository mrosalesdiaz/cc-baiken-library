const { ccclass, executeInEditMode, property, menu, requireComponent } = cc._decorator;
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
@menu('cc-baiken/Paint Circle')
@executeInEditMode()
@requireComponent(cc.Graphics)
export default class DrawCircle extends cc.Component {
    @property(cc.Boolean)
    paintOnlyInEditor: boolean = true;

    onLoad() {
        if (!CC_EDITOR && this.paintOnlyInEditor) { return; }

        const g = this.node.getComponent(cc.Graphics);

        g.clear();
        g.ellipse(0, 0, this.node.width / 2, this.node.height / 2);
        g.moveTo(0, 0);
        g.lineTo(0, this.node.height / 2);
        g.stroke();
    }

}
