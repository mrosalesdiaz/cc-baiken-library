import { BaseBehavior, Kinematic, SteeringOutput, defaultSteeringOutput } from "./core";
import { MathHelper } from "./common";

export default class AlignBehavior extends BaseBehavior {

    node: cc.Node;

    target: Kinematic;

    /**
     * Holds the radius for arriving at the target
     */
    targetRadius: number = Math.PI / 128;

    /**
     * Radius for arriving the target
     */
    slowRadius: number = Math.PI / 6;

    /**
     * Holds the time over which toachieve the target speed
     */
    timeToTarget: number = .005;

    getSteering(): SteeringOutput {
        const steering: SteeringOutput = defaultSteeringOutput();

        let rotation = this.target.orientation - this.character.orientation;

        rotation = MathHelper.wrapRadian(rotation)
        let rotationSize = Math.abs(rotation);

        //cc.log(rotationSize, ' must be less than', this.targetRadius)
        if (rotationSize < this.targetRadius) {
            return null;
        }

        let targetRotation;
        if (rotationSize > this.slowRadius) {
            targetRotation = this.character.maxRotation;
        } else {
            targetRotation = this.character.maxRotation * rotationSize / this.slowRadius;
        }

        targetRotation *= rotation / rotationSize;

        steering.angular = targetRotation - this.character.rotation;
        steering.angular /= this.timeToTarget;

        let angularAcceleration = Math.abs(steering.angular);

        if (angularAcceleration > this.character.maxAngularAcceleration) {
            steering.angular /= angularAcceleration;
            steering.angular *= this.character.maxAngularAcceleration;
        }

        steering.linear = cc.Vec2.ZERO;
        return steering;
    }
}