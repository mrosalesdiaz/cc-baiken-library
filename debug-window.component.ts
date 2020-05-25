import DelayUtil from "./delay-util";

const { ccclass, property } = cc._decorator;

let INSTANCE: DebugWindow;

export function DebugProperty(name: string, fnValue: Function, index: number = null): void {
    if (INSTANCE) {
        cc.error(`Cannot register variable '${name}' for debug. The debbuger instance was not created yet.`)
    }
    if (index == null) {
        index = ++INSTANCE.lastIndex;
    }

    INSTANCE.attributes.push({ index, name, fnValue })
}

/**
 * Script component to activate a debug on screen. Just add this script component into Canvas node.
 * It will create a cc.node and a cc.label that will be positioned the left top corner. 
 * Then import the function DebugProperty in order to directly register properties.
 * 
 * 
 * Example
 *   import { DebugProperty } from "./debug-window.component";
 *   (...)
 *   DebugProperty('Velocity', () => this.velocity.toFixed(2));
 * 
 * @author mrosalesdiaz
 */
@ccclass
export default class DebugWindow extends cc.Component {

    @property(cc.Boolean)
    disableDebug: Boolean = true;

    lastIndex: number = 10;
    attributes: any[] = [];
    label: cc.Label;

    skipTextUpdate: DelayUtil = new DelayUtil();

    onLoad() {
        const node = new cc.Node();

        this.label = node.addComponent(cc.Label);
        this.label.fontSize = 16;
        this.label.lineHeight = 18;
        this.label.node.scale = 0.2;
        this.label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        node.anchorX = 0;
        node.anchorY = 1;
        node.opacity = 200;

        node.parent = cc.find('Canvas/Main Camera');

        node.position = new cc.Vec3(-cc.view.getVisibleSize().width / 2, cc.view.getVisibleSize().height / 2, node.position.z).add(new cc.Vec3(2, -2, 0));

        INSTANCE = this;
    }

    update(dt: number): void {
        if (this.disableDebug) {
            return;
        }
        if (this.skipTextUpdate.update(dt).skip(.9)) {
            return;
        }
        this.label.string = this.attributes.sort((a, b) => a.index - b.index).map(l => ` [${l.index}:${l.name}] ${JSON.stringify(l.fnValue())}`).join('\n')
    }
    lateUpdate(dt: number): void {
        if (this.disableDebug) {
            return;
        }
    }
}
