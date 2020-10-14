import { VectorHelper } from "./common";
import { BaseBehavior, SteeringOutput, defaultSteeringOutput } from "./core";

export default class ArriveBehavior extends BaseBehavior {

  kinematic: cc.Node;

  applyTransformSelf() {
    if (this.kinematic === null) {
      throw 'Kinematic not set';
    }
    this.applyTransform(this.kinematic);
  }

  applyTransform(node: cc.Node) {
    node.position = VectorHelper.toVec3(this.character.position);
    node.angle = cc.misc.radiansToDegrees(this.character.orientation - MathHelper.TAU / 4);
  }
  targetPosition: cc.Vec2

  arrivingRadius: number;

  timeToTarget: number = 0.25;
  target: cc.Vec2;

  getSteering(): SteeringOutput {
    const steeringOutput = defaultSteeringOutput();

    steeringOutput.linear = this.targetPosition.sub(this.character.position);

    if (this.character.velocity.mag() < this.arrivingRadius) {
      return null;
    }

    steeringOutput.linear = steeringOutput.linear.div(this.timeToTarget);

    if (steeringOutput.linear.mag() > this.character.maxVelocity) {
      steeringOutput.linear = steeringOutput.linear.normalize().multiplyScalar(this.character.maxVelocity);
    }

    this.character.orientation = this.getNewOrientation(this.character.orientation, steeringOutput.linear)

    steeringOutput.angular = 0;
    return steeringOutput;
  }

  getNewOrientation(orientation: number, linear: cc.Vec2): number {
    if (linear.mag() == 0) {
      return Math.atan2(-this.character.velocity.y, this.character.velocity.x);
    } else {
      return orientation;
    }
  }
}
