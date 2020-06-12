import { VectorHelper, MathHelper } from "./common";

export const defaultSteeringOutput: () => SteeringOutput = () => {
    return {
        linear: cc.Vec2.ZERO,
        angular: 0
    }
}

export interface SteeringOutput {
    /**
     * Linear acceleration
     */
    linear?: cc.Vec2;
    /**
     * Angular acceleration
     */
    angular?: number;
}

export interface Location {
    /**
     * Current position
     */
    position: cc.Vec2;
    /**
     * Angle orientation based on normal coodinate
     */
    orientation: number;

    /** 
     * Linear velocity
     */
    velocity: cc.Vec2;
    /**
     * Angular Velocity
     */
    rotation: number;
}

export interface Limits {
    /**
     * Maximum velocity of the character
     */
    maxVelocity?: number;
    /**
     * Maximum acceleration of the character
     */
    maxAcceleration?: number;
    /**
     * Max rotation velocity
     */
    maxRotation?: number;
    /**
     * Max angular acceleration
     */
    maxAngularAcceleration?: number;
}

export class Kinematic implements Location, Limits {
    velocity: cc.Vec2 = cc.Vec2.ZERO;
    rotation: number = 0;
    position: cc.Vec2 = cc.Vec2.ZERO;
    orientation: number = 0;

    maxVelocity?: number = 800;
    maxAcceleration?: number = 800;
    maxRotation?: number = Math.PI / 3;
    maxAngularAcceleration?: number = Math.PI / 3;

    static fromNode(node: cc.Node): Kinematic {
        const newKinematic = new Kinematic();
        newKinematic.position = VectorHelper.toVec2(node.position);
        newKinematic.orientation = cc.misc.radiansToDegrees(node.angle);
        return newKinematic;
    }

    update(dt: number, steering) {
        if (steering == null) {
            return;
        }
        const scale = dt;
        this.velocity = this.velocity.add(steering.linear.multiplyScalar(scale))
        this.velocity = VectorHelper.limit(this.velocity, this.maxVelocity);
        this.position = this.position.add(this.velocity);

        this.rotation += steering.angular * dt;
        this.rotation = cc.misc.clampf(this.rotation, -this.maxRotation, this.maxRotation);
        this.orientation += this.rotation * dt;

    }
}

export abstract class BaseBehavior {

    private _character: Kinematic;
    public get character(): Kinematic {
        return this._character;
    }
    public set character(v: Kinematic) {
        this._character = v;
    }

    private _node: cc.Node;
    public get node(): cc.Node {
        return this._node;
    }
    public set node(v: cc.Node) {
        this._node = v;
    }

    set enableDebug(val: boolean) {
        if (!this.node) {
            cc.error(`The node was not set`);
        }
        if (this.node && !this.node.parent) {
            cc.error(`There is no parent for node: ${this.node.name}`);
        }
        if (val) {
            const evt = new cc.Event.EventCustom('debug-this', true);
            evt.detail = this
            this.node.dispatchEvent(evt);
        }
    }

    update(dt: number) {
        this.character.update(dt, this.getSteering());
    }

    applyToNode() {
        this.node.position = VectorHelper.toVec3(this.character.position);
        this.node.angle = cc.misc.radiansToDegrees(this.character.orientation - MathHelper.TAU / 4);
    }

    protected getSteering(): SteeringOutput {
        return defaultSteeringOutput();
    }
}