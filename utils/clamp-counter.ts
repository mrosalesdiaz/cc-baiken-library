
export default class ClampCounter {
    private _ratio: number = 0;
    public get ratio() {
        return this._ratio;
    }
    public velocity: number;

    constructor(velocity?: number) {
        if (velocity === undefined) { return; }
        this.velocity = velocity;
    }

    public update(dt: number): ClampCounter {
        this._ratio += dt * this.velocity;
        this._ratio = cc.misc.clamp01(this._ratio);
        return this;
    }

    public clear(): void {
        this._ratio = 0;
    }
}
