const { ccclass, property } = cc._decorator;
/**
 * Class to automatically destroy a node after a number of seconds configured in 'lifeTime'.
 * 
 * @example
 * Add as script component and set the value 'lifeTime'
 * 
 * @author mrosalesdiaz
 * @history 2020-05-26 mrosalesdiaz - Initial version
 */
@ccclass
export default class AutoTimeDestroy extends cc.Component {

    @property({
        type: cc.Integer,
        tooltip: 'Time in seconds to automatically destroy'
    })
    lifeTimeInSeconds: number = 60;

    onLoad() {
        this.scheduleOnce(() => this.detroyTheNode(), this.lifeTimeInSeconds);
    }

    detroyTheNode() {
        if (cc.isValid(this.node)) {
            this.node.destroy();
        }
    }

}
