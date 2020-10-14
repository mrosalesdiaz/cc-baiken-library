import { MathHelper, VectorHelper } from "../steering/common";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Graphics)
export default class DebugVector extends cc.Component {

    @property(cc.String)
    componentTypeName: string = '';

    @property(cc.String)
    componentAttributeName: string = '';

    @property(cc.Node)
    nodeRef: cc.Node = null;

    @property(cc.Integer)
    maxVectorLength: number = 0;

    private componentRef: cc.Component = null;

    private g: cc.Graphics;

    private label1: cc.Label;
    private label2: cc.Label;

    private resizeExecuted: boolean = true;

    onLoad() {
        if (this.nodeRef === null || this.componentTypeName === '' || this.componentAttributeName === '') {
            this.enabled = false;
            return;
        }
        this.componentRef = this.nodeRef.getComponent(this.componentTypeName);

        if (this.componentRef === null || this.componentRef[this.componentAttributeName] == undefined) {
            this.enabled = false;
            return;
        }


        this.g = this.node.getComponent(cc.Graphics);

        const textNode1 = new cc.Node();
        textNode1.anchorY = 0;
        textNode1.color = this.node.color;
        this.label1 = textNode1.addComponent(cc.Label);
        this.label1.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        this.label1.verticalAlign = cc.Label.VerticalAlign.CENTER;
        this.label1.string = `${this.componentTypeName}`;
        textNode1.parent = this.node;

        const textNode2 = new cc.Node();
        textNode2.anchorY = 1;
        textNode2.color = this.node.color;
        this.label2 = textNode2.addComponent(cc.Label);
        this.label2.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        this.label2.verticalAlign = cc.Label.VerticalAlign.CENTER;
        this.label2.string = `${this.componentAttributeName}`;
        textNode2.parent = this.node;
    }

    update(dt: number) {
        if (this.resizeExecuted) {
            this.maxVectorLength = this.maxVectorLength ?? this.node.width / 2;
            this.resizeExecuted = false;
            this.label1.node.scale = MathHelper.calculateScaleFactor(this.label1.node.width, this.node.width) * .9;
            this.label2.node.scale = MathHelper.calculateScaleFactor(this.label2.node.width, this.node.width) * .9;
        }

        const actualVector = this.componentRef[this.componentAttributeName] as cc.Vec2;
        const scaledVector = VectorHelper.map(actualVector, this.maxVectorLength, this.node.width / 2);
        this.g.clear();
        this.g.moveTo(0, 0);
        this.g.lineTo(scaledVector.x, scaledVector.y);
        this.g.circle(scaledVector.x, scaledVector.y, 2);
        this.g.stroke();
    }

}
