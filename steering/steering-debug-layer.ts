import AlignBehavior from "./align-behavior";
import WanderBehavior from './wander-behavior'
import FaceBehavior from './face-behavior'
import SeekBehavior from "./seek-behavior";
import ArriveBehavior from "./arrive-behavior";
import { VectorHelper } from "./common";
import WanderWithLimitsBehavior from "./wander-with-limits";
const { ccclass, property } = cc._decorator;

@ccclass
export default class SteeringDebugLayer extends cc.Component {
    wanderBehaviors: WanderBehavior[] = [];
    wanderWithLimits: WanderWithLimitsBehavior[] = [];
    seekBehaviors: SeekBehavior[] = [];
    arriveBehaviors: ArriveBehavior[] = [];
    alignBehaviors: AlignBehavior[] = [];
    faceBehaviors: FaceBehavior[] = [];

    defaultStrokeColor: cc.Color;
    defaultFillColor: cc.Color;

    onLoad() {
        this.defaultStrokeColor = this.node.getComponent(cc.Graphics).strokeColor
        this.defaultFillColor = this.node.getComponent(cc.Graphics).fillColor

        this.node.parent.on('debug-this', this.onRegsisterForDebug, this);
        if (!this.node.getComponent(cc.Graphics)) {
            cc.error(`Node: ${this.node.name} requires Graphic component`)
        }
    }
    onRegsisterForDebug(evt: cc.Event.EventCustom) {
        evt.stopPropagation();
        const node: cc.Node = evt.currentTarget;
        if (evt.detail instanceof WanderBehavior) {
            this.wanderBehaviors.push(evt.detail);
        } else if (evt.detail instanceof WanderWithLimitsBehavior) {
            this.wanderWithLimits.push(evt.detail);
        } else if (evt.detail instanceof SeekBehavior) {
            this.seekBehaviors.push(evt.detail);
        } else if (evt.detail instanceof ArriveBehavior) {
            this.arriveBehaviors.push(evt.detail);
        } else if (evt.detail instanceof AlignBehavior) {
            this.alignBehaviors.push(evt.detail);
        } else if (evt.detail instanceof FaceBehavior) {
            this.faceBehaviors.push(evt.detail);
        }
    }

    update(dt: number) {
        if (this.node.getComponent(cc.Graphics)) {
            const g = this.node.getComponent(cc.Graphics);
            g.clear();

            this.renderWanderingBehaviors(g);
            this.renderWanderingWithLimitsBehaviors(g);
            this.renderSeekBehaviors(g);
            this.renderArriveBehaviors(g);
            this.renderAlignBehaviors(g);
            this.renderFaceBehaviors(g);

            this.arriveBehaviors = this.filterOnlyValid(this.arriveBehaviors);
            this.wanderBehaviors = this.filterOnlyValid(this.wanderBehaviors);
            this.wanderWithLimits = this.filterOnlyValid(this.wanderWithLimits);
            this.seekBehaviors = this.filterOnlyValid(this.seekBehaviors);
            this.alignBehaviors = this.filterOnlyValid(this.alignBehaviors);
            this.faceBehaviors = this.filterOnlyValid(this.faceBehaviors);
        }
    }
    renderFaceBehaviors(g: cc.Graphics) {
        this.faceBehaviors
            .filter(n => cc.isValid(n.node))
            .forEach((s) => {
                this.renderCircleForVehiclePosition(g, s.character.position, s.character.orientation - Math.PI / 2, s.node.width / 2, 200 / s.node.width);
                this.renderTarget(g, s.target.position);
            });
    }
    renderAlignBehaviors(g: cc.Graphics) {
        this.alignBehaviors
            .filter(n => cc.isValid(n.node))
            .forEach((s) => {
                this.renderCircleForVehiclePosition(g, s.character.position, s.character.orientation - Math.PI / 2, s.node.width / 2, 200 / s.node.width);
                this.renderTarget(g, VectorHelper.vectoFromAngle(s.target.orientation, 100))

            });
    }
    filterOnlyValid(behaviors: any) {
        return behaviors
            .filter(s => cc.isValid(s.node));
    }
    renderArriveBehaviors(g: cc.Graphics) {
        this.arriveBehaviors
            .filter(n => cc.isValid(n.node))
            .forEach((s) => {
                this.renderCircleForVehiclePosition(g, s.character.position, s.character.orientation, s.node.width / 2);
                this.renderTarget(g, s.targetPosition);
            });
    }
    renderTarget(g: cc.Graphics, targetPosition: cc.Vec2) {
        g.strokeColor = cc.Color.RED;

        [
            [cc.Vec2.UP, cc.Vec2.UP.neg()],
            [cc.Vec2.RIGHT, cc.Vec2.RIGHT.neg()]
        ]
            .map((twoPoints: cc.Vec2[]) => {
                twoPoints[0] = targetPosition.add(twoPoints[0].multiplyScalar(5));
                twoPoints[1] = targetPosition.add(twoPoints[1].multiplyScalar(5));
                return twoPoints;
            })
            .forEach((twoPoints: cc.Vec2[]) => {
                g.moveTo(twoPoints[0].x, twoPoints[0].y);
                g.lineTo(twoPoints[1].x, twoPoints[1].y);
                g.stroke();
            });

        g.strokeColor = this.defaultStrokeColor;
    }
    renderCircleForVehiclePosition(g: cc.Graphics, position: cc.Vec2, orientation: number, radius: number, scaleRadius: number = 1, strokeColor: cc.Color = cc.Color.YELLOW) {
        g.strokeColor = strokeColor;
        g.circle(position.x, position.y, radius);
        g.stroke();

        const directionRadius = Math.max(radius * 1.3, radius * scaleRadius);
        const directionTowards = position
            .add(cc.Vec2.UP.multiplyScalar(directionRadius).rotate(orientation));

        g.moveTo(position.x, position.y);
        g.lineTo(directionTowards.x, directionTowards.y);
        g.stroke();
        g.strokeColor = this.defaultStrokeColor;
    }
    renderSeekBehaviors(g: cc.Graphics) {
        this.seekBehaviors
            .filter(n => cc.isValid(n.node))
            .forEach((s) => {
                this.renderCircleForVehiclePosition(g, s.character.position, s.character.orientation, s.node.width / 2);
                this.renderTarget(g, s.targetPosition);
            });
    }
    renderWanderingBehaviors(g: cc.Graphics) {
        this.wanderBehaviors
            .filter(n => cc.isValid(n.node))
            .forEach(s => {
                this.renderCircleForVehiclePosition(
                    g,
                    s.character.position,
                    s.character.orientation - Math.PI / 2,
                    s.node.width / 2);


                this.renderCircleForVehiclePosition(
                    g,
                    s.character.position.add(VectorHelper.vectoFromAngle(s.character.orientation, s.wanderOffset)),
                    (s.wanderOrientation + s.character.orientation) - Math.PI / 2,
                    s.wanderRadius,
                    1,
                    cc.Color.GREEN);

                if (s.faceBehavior.target) {
                    g.strokeColor = cc.Color.RED;
                    g.moveTo(s.character.position.x, s.character.position.y)
                    const acc = s.faceBehavior.target.position
                    g.lineTo(acc.x, acc.y);
                    g.stroke();
                    g.strokeColor = this.defaultStrokeColor;
                }
            });
    }
    renderWanderingWithLimitsBehaviors(g: cc.Graphics) {
        this.wanderWithLimits
            .filter(n => cc.isValid(n.node))
            .forEach(s => {
                this.renderCircleForVehiclePosition(
                    g,
                    s.character.position,
                    s.character.orientation - Math.PI / 2,
                    s.node.width / 2);


                this.renderCircleForVehiclePosition(
                    g,
                    s.character.position.add(VectorHelper.vectoFromAngle(s.character.orientation, s.wander.wanderOffset)),
                    (s.wander.wanderOrientation + s.character.orientation) - Math.PI / 2,
                    s.wander.wanderRadius,
                    1,
                    cc.Color.GREEN);

                if (s.wander.faceBehavior.target) {
                    g.strokeColor = cc.Color.RED;
                    g.moveTo(s.character.position.x, s.character.position.y)
                    const acc = s.wander.faceBehavior.target.position
                    g.lineTo(acc.x, acc.y);
                    g.stroke();
                    g.strokeColor = this.defaultStrokeColor;
                }
            });
    }
}
