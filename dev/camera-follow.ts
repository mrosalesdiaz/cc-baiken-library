import Easings from "../utils/easings.util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraFollow extends cc.Component {

    @property(cc.Node)
    playerNode: cc.Node = null;

    update(dt: number) {
        this.node.setPosition(this.playerNode.position);
    }
}
