
const { ccclass, property } = cc._decorator;

@ccclass
export default class ShortcutsDev extends cc.Component {
    ctrlPressed = false;
    onLoad() {
        document.querySelector('#btn-recompile')['accessKey'] = 'p'
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (e) {
            if (!this.ctrlPressed && e.keyCode == cc.macro.KEY.ctrl) {
                this.ctrlPressed = true;
            }
        })
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (e) {
            if (e.keyCode == cc.macro.KEY.ctrl) {
                this.ctrlPressed = false;
            }
            if (this.ctrlPressed && e.keyCode == cc.macro.KEY.r) {
                cc.game.restart();
            }
        }, false);
    }
}
