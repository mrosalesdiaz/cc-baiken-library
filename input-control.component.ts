import { DebugProperty } from "./debug-window.component";

const { ccclass, property } = cc._decorator;

let INSTANCE: InputControl;

export function GetAxisX(): number {
    return INSTANCE.controlStates['HORIZONTAL'];
}

export function GetAxisY(): number {
    return INSTANCE.controlStates['VERTICAL'];
}

export function GetRotationAngle(): number {
    return INSTANCE.controlStates['CAMERA'];
}

export function GetButtonPressed(buttonName: string): boolean {
    return INSTANCE.controlStates[buttonName];
}

export function GetButtonAccumulated(buttonName: string): boolean {
    return INSTANCE.pressedTime[buttonName];
}

export function GetButtonPreseedOnce(buttonName: string): boolean {
    const pressed = GetButtonPressed(buttonName);
    if (!pressed) {
        return pressed;
    }
    INSTANCE.controlStates[buttonName] = false;
    INSTANCE.preseedInstance[buttonName] = false;
    return pressed;
}

/**
 * Script component to support keyboard controller.
 */
@ccclass
export default class InputControl extends cc.Component {
    @property(cc.Boolean)
    disableDebug: boolean = true;

    pressedKeys: any = {};
    pressedTime: any = {};
    preseedInstance: any = {};

    controlStates: any = {};


    onLoad(): void {
        INSTANCE = this;

        this.controlStates['HORIZONTAL'] = 0;
        this.controlStates['VERTICAL'] = 0;
        this.controlStates['CAMERA'] = 0;
        this.controlStates['FIRE'] = false;

        this.preseedInstance['LEFT'] = true;
        this.preseedInstance['RIGHT'] = true;
        this.preseedInstance['UP'] = true;
        this.preseedInstance['DOWN'] = true;
        this.preseedInstance['ROTATE_LEFT'] = true;
        this.preseedInstance['ROTATE_RIGHT'] = true;
        this.preseedInstance['FIRE'] = true;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.pressButton, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.releaseButton, this);
    }
    releaseButton(evt: KeyboardEvent, releaseButton: any, arg2: this) {
        switch (evt.keyCode) {
            case cc.macro.KEY.left:
                this.pressedKeys['LEFT'] = false;
                this.preseedInstance['LEFT'] = true;
                break;
            case cc.macro.KEY.right:
                this.pressedKeys['RIGHT'] = false;
                this.preseedInstance['RIGHT'] = true;
                break;


            case cc.macro.KEY.up:
                this.pressedKeys['UP'] = false;
                this.preseedInstance['UP'] = true;
                break;
            case cc.macro.KEY.down:
                this.pressedKeys['DOWN'] = false;
                this.preseedInstance['DOWN'] = true;
                break;


            case cc.macro.KEY.a:
                this.pressedKeys['ROTATE_LEFT'] = false;
                this.preseedInstance['ROTATE_LEFT'] = true;
                break;
            case cc.macro.KEY.d:
                this.pressedKeys['ROTATE_RIGHT'] = false;
                this.preseedInstance['ROTATE_RIGHT'] = true;
                break;


            case cc.macro.KEY.space:
                this.pressedKeys['FIRE'] = false;
                this.preseedInstance['FIRE'] = true;
                break;
        }

    }
    pressButton(evt: KeyboardEvent, pressButton: any, arg2: this) {
        switch (evt.keyCode) {
            case cc.macro.KEY.left:
                this.pressedKeys['LEFT'] = true;
                break;
            case cc.macro.KEY.right:
                this.pressedKeys['RIGHT'] = true;
                break;

            case cc.macro.KEY.up:
                this.pressedKeys['UP'] = true;
                break;
            case cc.macro.KEY.down:
                this.pressedKeys['DOWN'] = true;
                break;

            case cc.macro.KEY.a:
                this.pressedKeys['ROTATE_LEFT'] = true;
                break;
            case cc.macro.KEY.d:
                this.pressedKeys['ROTATE_RIGHT'] = true;
                break;

            case cc.macro.KEY.space:
                this.pressedKeys['FIRE'] = true;
                break;
        }
    }

    onDestroy(): void {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.pressButton, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.releaseButton, this);

        INSTANCE = null;
    }

    start() {
        if (!this.disableDebug) {
            DebugProperty('HORIZONTAL', () => this.controlStates['HORIZONTAL']);
            DebugProperty('FIRE', () => this.controlStates['FIRE']);
            DebugProperty('FIRE', () => this.pressedKeys['FIRE']);
            DebugProperty('CAMERA', () => this.controlStates['CAMERA']);
        }
    }

    lateUpdate() {
        {
            let newHorizontal = 0;

            if (this.pressedKeys['LEFT']) {
                newHorizontal += -1;
            } else {
                this.lateUpdate['LEFT'] = 0;
            }

            if (this.pressedKeys['RIGHT']) {
                newHorizontal += 1;
            } else {
                this.lateUpdate['RIGHT'] = 0;
            }
            this.controlStates['HORIZONTAL'] = newHorizontal;
        }

        {
            let newVertical = 0;

            if (this.pressedKeys['DOWN']) {
                newVertical += -1;
            } else {
                this.lateUpdate['DOWN'] = 0;
            }

            if (this.pressedKeys['UP']) {
                newVertical += 1;
            } else {
                this.lateUpdate['UP'] = 0;
            }
            this.controlStates['VERTICAL'] = newVertical;
        }

        {
            let newCameraRotation = 0;

            if (this.pressedKeys['ROTATE_LEFT']) {
                newCameraRotation += 1;
            } else {
                this.lateUpdate['ROTATE_LEFT'] = 0;
            }

            if (this.pressedKeys['ROTATE_RIGHT']) {
                newCameraRotation += -1;
            } else {
                this.lateUpdate['ROTATE_RIGHT'] = 0;
            }
            this.controlStates['CAMERA'] = newCameraRotation;
        }

        let newFireState = false;
        if (this.pressedKeys['FIRE']) {
            if (this.preseedInstance['FIRE'] === true) {
                newFireState = true;
            }
        } else {
            this.lateUpdate['FIRE'] = 0;
        }
        this.controlStates['FIRE'] = newFireState;
    }

    update(dt: number) {
        Object.keys(this.pressedKeys)
            .filter(a => this.pressedKeys[a])
            .forEach(a => this.lateUpdate[a] += dt);
    }
}
