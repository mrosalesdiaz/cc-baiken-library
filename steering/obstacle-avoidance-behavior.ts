import { BaseBehavior, SteeringOutput } from "./core";
import SeekBehavior from "./seek-behavior";

interface Collision {
    position: cc.Vec2;
    normal: cc.Vec2;
}

class CollisionDetector {

    getCollision(position: cc.Vec2, moveAmount: cc.Vec2): Collision {
        return null;
    }
    process(other: cc.BoxCollider, self: cc.CircleCollider): Collision {
        // self.getComponent(BulletController).velocity = cc.Vec3.ZERO;
        // this.bulletHit.active = true;
        // this.bulletHit.getComponent(cc.Animation).play('bullet-hit');

        // if (other.node.parent && other.node.parent.getComponent(Enemy)) {
        //     other.node.parent.parent.getComponent(EnemyIA).releaseEnemy(other.node.parent);
        //     other.node.parent.destroy();
        // }
        return null;
    }
}

export default class ObstacleAvoidanceBehavior extends BaseBehavior {

    /**
     * Holds the collision detector
     */
    collisionDetector: CollisionDetector

    /**
     * Holds a the minimun distance to a wall (i.e. how far to avoid collision)
     * should be greater than the radius of the character
     */
    avoidDistance

    /**
     * Holds the distance to look ahead for a collision
     * (i.e. the lenght of the collision ray)
     */
    lookahead;

    seekBehavior: SeekBehavior;

    constructor() {
        super();
        this.seekBehavior = new SeekBehavior();
    }

    getSteering(): SteeringOutput {
        // 1. Calculate the target to delegatr to seek

        // Calculate the collision ray vector
        const rayVector = this.character.velocity.normalize().multiplyScalar(this.lookahead);

        // Find the collision
        const collision = this.collisionDetector.getCollision(this.character.position, rayVector);

        // If have no collision, do nothing
        if (!collision) {
            return null;
        }

        // Otherwise create a target
        const target = collision.position.add(collision.normal.multiplyScalar(this.avoidDistance))

        this.seekBehavior.targetPosition = target;

        return this.seekBehavior.getSteering();
    }
}
