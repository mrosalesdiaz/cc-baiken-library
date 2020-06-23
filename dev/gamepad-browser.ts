
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

    private pad0Connect: boolean = false;
    private pad0index: number = 0;

    private __handleGamepadConnected: (evt: GamepadEvent) => void;
    private __handleGamepadDisconnected: (evt: GamepadEvent) => void;

    public get gamepad(): Gamepad {
        return navigator.getGamepads()[this.pad0index];
    };

    onLoad() {
        this.__handleGamepadConnected = this.handleGamepadConnected.bind(this);
        this.__handleGamepadDisconnected = this.handleGamepadConnected.bind(this);
        if (navigator.getGamepads()[this.pad0index]) {
            this.pad0Connect = navigator.getGamepads()[this.pad0index].connected
        }
        window.addEventListener("gamepadconnected", this.__handleGamepadConnected);
        window.addEventListener("gamepaddisconnected", this.__handleGamepadDisconnected);
    }

    onDestroy() {
        window.removeEventListener("gamepadconnected", this.__handleGamepadConnected);
        window.removeEventListener("gamepaddisconnected", this.__handleGamepadDisconnected);
    }

    handleGamepadConnected(evt: GamepadEvent) {
        this.pad0Connect = true;
        this.pad0index = evt.gamepad.index;
        cc.log(`Gamepad connected ${this.gamepad.id}`);
    }

    handleGamepadDisconnected(evt: GamepadEvent) {
        if (evt.gamepad.index == this.pad0index) { this.pad0Connect = false; }
        cc.log(`Gamepad disconnected ${this.gamepad.id}`);
    }

    update() {
        if (!this.pad0Connect || this.gamepad == null) { return; }

        let newDirection = new cc.Vec2(
            parseFloat(this.gamepad.axes[0].toFixed(1))
            , -parseFloat(this.gamepad.axes[1].toFixed(1)));

        if (newDirection.mag() > 1) {
            newDirection = newDirection.normalize();
        }
        this.axisLeft = newDirection;
    }
}
