
const { ccclass, property, menu } = cc._decorator;
/**
 * Helper component responsible to access gamepad device.
 * It only works for Browser enable gamepad API
 * 
 * @example
 * Just add the node to the root node. And use the properties:
 * - axisLeft: vector representing left stick
 * 
 * @author mrosalesdiaz
 * @history 2020-06-20 mrosalesdiaz - Initial version
 */
@ccclass
@menu('cc-baiken/Browser GamePad')
export default class GamepadBrowserComponent extends cc.Component {
    axisLeft: cc.Vec2 = cc.Vec2.ZERO;
    gamepad: Gamepad = null;

    onLoad() {
        debugger;
        window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
            this.gamepad = event.gamepad;
            cc.log(`Gamepad connected ${this.gamepad.id}`);
        });
    }

    update() {
        if (this.gamepad) { return; }

        this.axisLeft = new cc.Vec2(this.gamepad.axes[0], this.gamepad.axes[1]);
    }
}
