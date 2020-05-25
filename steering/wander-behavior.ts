import { BaseBehavior, SteeringOutput, Kinematic } from "./core";
import { MathHelper, VectorHelper } from "./common";
import FaceBehavior from "./face-behavior";

export default class WanderBehavior extends BaseBehavior {

    node: cc.Node;

    faceBehavior: FaceBehavior

    /**
     * Forward offset of the wander circle
     */
    wanderOffset: number = 100;
    /**
     * Radius  of the wander circle
     */
    wanderRadius: number = 20;
    /**
     * The maximun rate at which the wander orientation can change
     */
    wanderRate: number = 0.05;

    /**
     * The current orientation of the wander circle
     */
    wanderOrientation: number = 0

    get character(): Kinematic {
        return this.faceBehavior.character;
    }
    set character(val: Kinematic) {
        this.faceBehavior.character = val;
    }


    constructor() {
        super();
        this.faceBehavior = new FaceBehavior();
    }

    getSteering(): SteeringOutput {
        this.wanderOrientation += MathHelper.binomialRandom() * this.wanderRate;
        this.wanderOrientation = cc.misc.clampf(this.wanderOrientation, -Math.PI / 6, Math.PI / 6)

        const targetOrientation = this.wanderOrientation + this.character.orientation;

        const chracterOrientationAsVector = VectorHelper.vectoFromAngle(this.character.orientation);
        let target = this.character.position.add(chracterOrientationAsVector.normalize().multiplyScalar(this.wanderOffset))
        const targetOrientationAsvector = VectorHelper.vectoFromAngle(targetOrientation);
        target = target.add(targetOrientationAsvector.normalize().multiplyScalar(this.wanderRadius));

        this.faceBehavior.target = new Kinematic();
        this.faceBehavior.target.position = target;

        let steering: SteeringOutput = this.faceBehavior.getSteering();

        if (steering == null) {
            steering = { angular: 0 };
        }
        steering.linear = VectorHelper.vectoFromAngle(this.character.orientation).normalize().multiplyScalar(this.character.maxAcceleration)

        return steering;
    }
}