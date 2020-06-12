/**
 * Helper class to create a object to accumulate values with a clamp01.
 * 
 * @example
 * private alignCamera: ClampCounter = new ClampCounter();
 * ...
 * this.alignCamera.update(dt).ratio
 * ...
 * if(changed){
 *  this.alignCamera.reset();
 * }
 * 
 * @author mrosalesdiaz
 * @history 2020-06-11 mrosalesdiaz - Initial version
 * 
 */
export default class ClampCounter {
    private _ratio: number = 0;
    public get ratio() {
        return this._ratio;
    }
    public velocity: number = 1;

    constructor(velocity: number = 1) {
        this.velocity = velocity;
    }

    public update(dt: number): ClampCounter {
        this._ratio += dt * this.velocity;
        this._ratio = cc.misc.clamp01(this._ratio);
        return this;
    }

    public reset(): void {
        this._ratio = 0;
    }
}
