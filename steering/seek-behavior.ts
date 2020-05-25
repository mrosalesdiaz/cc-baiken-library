import { BaseBehavior } from "./core";
import { SteeringOutput, defaultSteeringOutput } from "./core";

export default class SeekBehavior extends BaseBehavior {
  targetPosition: cc.Vec2;

  getSteering(): SteeringOutput {
    const steering = defaultSteeringOutput()

    steering.linear = this.targetPosition.sub(this.character.position)
      .normalize()
      .multiplyScalar(this.character.maxVelocity);

    this.character.orientation = this.getNewOrientation(this.character.orientation, steering.linear);

    steering.angular = 0;

    return steering;
  }
  getNewOrientation(orientation: number, linear: cc.Vec2): number {
    if (linear.mag() == 0) {
      return Math.atan2(-this.character.velocity.y, this.character.velocity.x);
    } else {
      return orientation;
    }
  }

}
