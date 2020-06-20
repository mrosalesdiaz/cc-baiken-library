
const { ccclass, property, menu } = cc._decorator;

/**
 * Class to define some shortcuts for interation in development.
 * 
 * @example
 * Just add the node to the root node.
 * Shortcuts:
 *  command + r: restart game
 *  command + p: recompile game
 * 
 * @author mrosalesdiaz
 * @history 2020-05-26 mrosalesdiaz - Initial version
 */
@ccclass
@menu('cc-baiken/Dev Shortcuts')
export default class ShortcutsDev extends cc.Component {
    ctrlPressed = false;
    oneLateUpdate: (() => void)[] = [];

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this, false);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this, false);
    }
    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(evt: KeyboardEvent) {
        if (!this.ctrlPressed && evt.keyCode == cc.macro.KEY.ctrl) {
            this.ctrlPressed = true;
        }
    }

    onKeyUp(evt: KeyboardEvent) {
        if (evt.keyCode == cc.macro.KEY.ctrl) {
            this.ctrlPressed = false;
        }

        if (this.ctrlPressed && evt.keyCode == cc.macro.KEY.r) {
            this.oneLateUpdate.push(() => cc.game.restart());
        }
        if (this.ctrlPressed && evt.keyCode == cc.macro.KEY.p) {
            try {
                document.querySelector('#btn-recompile')['click']();
            } catch (ex) {
                cc.error('Recompile not supported in native mode.');
            }
        }
    }

    lateUpdate(dt) {
        if (cc.isValid(this) && this.oneLateUpdate.length > 0) {
            this.oneLateUpdate.forEach(fn => fn());
            this.oneLateUpdate.splice(0, this.oneLateUpdate.length)
        }
    }
}
