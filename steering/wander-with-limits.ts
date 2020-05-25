import { BaseBehavior, SteeringOutput } from "./core";
import WanderBehavior from "./wander-behavior";
import ObstacleAvoidanceBehavior from "./obstacle-avoidance-behavior";

export default class WanderWithLimitsBehavior extends BaseBehavior {

    wander: WanderBehavior = new WanderBehavior();
    obstacleAvoidance: ObstacleAvoidanceBehavior = new ObstacleAvoidanceBehavior();

    get character() { return this.wander.character; };
    set character(val) { this.wander.character = val; };

    constructor() {
        super();
        this.obstacleAvoidance.character = this.character;
        this.obstacleAvoidance.avoidDistance = 50;
        this.obstacleAvoidance.lookahead = 50
    }

    getSteering(): SteeringOutput {

        const steeringOuput = this.wander.getSteering();

        const obstacleAvoidanceOutput = this.obstacleAvoidance.getSteering();
        if (obstacleAvoidanceOutput != null) {
            steeringOuput.linear = obstacleAvoidanceOutput.linear;
            steeringOuput.angular = obstacleAvoidanceOutput.angular;
        }

        return steeringOuput;
    }

}
