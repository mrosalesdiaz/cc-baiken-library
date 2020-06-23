const { ccclass, property } = cc._decorator;

@ccclass
export default class FollowNodeComponent extends cc.Component {
    @property(cc.Node)
    nodeToFollow: cc.Node = null;

    @property(cc.Vec3)
    offset: cc.Vec3 = cc.Vec3.ZERO;

    update() {
        this.node.position = this.nodeToFollow.position.add(this.offset);
    }

}
