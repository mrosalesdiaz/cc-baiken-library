import FnUpdate from "./FnUpdate";
import SpaceShip from "../prefabs/ship-x1/scripts/spaceship.interface";
import MotherAlien from "../prefabs/mother-alien/scripts/mother-alien.interface";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraController extends cc.Component {

    @property(cc.Node)
    playerNode: cc.Node = null;

    @property(cc.Integer)
    PADDING: number = 2;
    DISTANCE_TO_PLAYER: number;

    // Update Ship Vertical Movement
    logicVertical: FnUpdate = new FnUpdate();
    // --------------------

    // Globals Variables
    private currentPlayerDirection: cc.Vec2;
    private currentPlayerPosition: cc.Vec2;
    // --------------------

    start() {
        this.DISTANCE_TO_PLAYER = cc.view.getVisibleSize().height / 3 - this.PADDING;

        this.logicVertical.handlerImplementation = this.updateCameraPosition.bind(this);
    }

    update(dt: number) {
        this.updateGlobals();
        this.logicVertical.enable(true).update(dt);
    }

    private updateCameraPosition(dt: number, previous: any, evt: any): any {
        const newCameraPosition: cc.Vec2 = this.currentPlayerDirection.clone()
            // increments vector length by distance
            .multiplyScalar(this.DISTANCE_TO_PLAYER / this.currentPlayerDirection.mag())
            .add(this.currentPlayerPosition);

        this.node.x = newCameraPosition.x;
        this.node.y = newCameraPosition.y;

        this.node.eulerAngles = new cc.Vec3(
            0,
            0,
            cc.misc.radiansToDegrees(cc.Vec2.RIGHT.signAngle(this.currentPlayerDirection) + 3 * Math.PI / 2)
        );

        return 0;
    }

    private updateGlobals() {
        if (this.playerNode.getComponent(SpaceShip)) {
            this.currentPlayerDirection = this.playerNode.getComponent(SpaceShip).direction;
        } else if (this.playerNode.getComponent(MotherAlien)) {
            this.currentPlayerDirection = this.playerNode.getComponent(MotherAlien).direction;
        } else {
            this.currentPlayerDirection = cc.Vec2.UP;
        }
        this.currentPlayerPosition = new cc.Vec2(this.playerNode.position.x, this.playerNode.position.y);
    }

}
