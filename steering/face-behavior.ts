import { BaseBehavior, SteeringOutput, Kinematic } from "./core";
import AlignBehavior from "./align-behavior";
import { VectorHelper } from "./common";

export default class FaceBehavior extends BaseBehavior {

    node: cc.Node;

    get character(): Kinematic {
        return this.alignBehavior.character;
    }
    set character(val: Kinematic) {
        this.alignBehavior.character = val;
    }


    get target(): Kinematic {
        return this.alignBehavior.target;
    }
    set target(val: Kinematic) {
        this.alignBehavior.target = val;
    }

    alignBehavior: AlignBehavior;
    constructor() {
        super();
        this.alignBehavior = new AlignBehavior();
    }

    getSteering(): SteeringOutput {
        const direction = this.alignBehavior.target.position.sub(this.alignBehavior.character.position);
        if (direction.mag() == 0) {
            return null;
        }

        this.alignBehavior.target.orientation = VectorHelper.heading(direction);

        return this.alignBehavior.getSteering();
    }
}